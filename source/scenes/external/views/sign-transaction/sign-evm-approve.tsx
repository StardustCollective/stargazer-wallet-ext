import { Skeleton } from '@material-ui/lab';
import { BigNumber, ethers } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useBalance } from 'hooks/external/useBalance';
import useExternalGasEstimate from 'hooks/external/useExternalGasEstimate';
import { useExternalViewData } from 'hooks/external/useExternalViewData';
import useTokenInfo from 'hooks/external/useTokenInfo';

import ApprovalWarning, { type ApprovalWarningSeverity } from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import GasSlider from 'scenes/external/components/GasSlider';
import RawDataToggle from 'scenes/external/components/RawDataToggle';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import { type TokenStandard, TransactionType } from 'scenes/external/SignTransaction/types';
import { ellipsis } from 'scenes/home/helpers';

import { WalletParam } from 'scripts/Background/messaging';
import { decodeCall, type DecodedCall } from 'scripts/Provider/evm/utils/decodeCall';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { usePlatformAlert } from 'utils/alertUtil';
import { formatApprovalAmount, formatDeadline } from 'utils/approvalAmount';
import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignEvmApproveProps {
  title: string;
  nativeAsset: IAssetInfoState | null;
  transaction: EthSendTransaction;
  tokenStandard?: TokenStandard;
  footer?: string;
  containerStyles?: string;
  isLoading?: boolean;
  wallet: WalletParam;
  setGasConfig?: ({ gasPrice, gasLimit }: { gasPrice: string; gasLimit: string }) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

type AllowanceCall = Extract<DecodedCall, { method: 'approve' | 'increaseAllowance' | 'decreaseAllowance' | 'permit' }>;

const METHOD_LABELS: Record<AllowanceCall['method'], string> = {
  approve: 'Approve',
  increaseAllowance: 'Increase allowance',
  decreaseAllowance: 'Decrease allowance',
  permit: 'Permit',
};

const VALUE_LABELS: Record<TokenStandard, string> = {
  erc20: 'Amount:',
  erc721: 'Token ID:',
  erc1155: 'Amount:',
  unknown: 'Amount or token ID:',
};

// The allowance the call sets or changes: what the spender may move once it executes.
const grantedAmount = (call: AllowanceCall): BigNumber => {
  if (call.method !== 'permit') return call.amount;
  if (call.variant === 'erc2612') return call.value;
  return call.allowed ? ethers.constants.MaxUint256 : ethers.constants.Zero;
};

const permitDeadline = (call: Extract<AllowanceCall, { method: 'permit' }>) =>
  call.variant === 'erc2612' ? formatDeadline(call.deadline) : formatDeadline(call.expiry, { zeroMeansNever: true });

// `amount` is formatted without the symbol, which the sentence adds itself.
const allowanceWarning = (
  call: AllowanceCall,
  tokenStandard: TokenStandard,
  symbol: string,
  amount: { display: string; isUnlimited: boolean }
): { severity: ApprovalWarningSeverity; text: string } | null => {
  const grant = grantedAmount(call);

  if (call.method === 'decreaseAllowance') {
    return {
      severity: 'caution',
      text: `This lowers ${call.spender}'s allowance for your ${symbol} by ${amount.display}.`,
    };
  }

  if (call.method === 'permit' && grant.isZero()) {
    return { severity: 'caution', text: `This removes ${call.spender}'s permission to spend your ${symbol}.` };
  }

  if (call.method === 'approve' && tokenStandard === 'erc721') {
    return { severity: 'danger', text: `This lets ${call.spender} transfer your token #${grant.toString()}.` };
  }

  if (call.method === 'increaseAllowance' || call.method === 'permit') {
    const more = call.method === 'increaseAllowance' ? ' more' : '';
    const spend = amount.isUnlimited ? 'an unlimited amount' : `up to ${amount.display}${more}`;
    return { severity: 'danger', text: `This lets ${call.spender} spend ${spend} of your ${symbol}.` };
  }

  return null;
};

const calculateFiat = (feeInWei: BigNumber, nativeAsset: IAssetInfoState) => {
  const { fiat } = store.getState().price;

  const assetPrice = fiat[nativeAsset.priceId]?.price || 0;
  const assetPriceInWei = ethers.utils.parseEther(assetPrice.toString());
  const divisor = ethers.utils.parseEther('1');

  const fiatInWei = feeInWei.mul(assetPriceInWei).div(divisor);
  const fiatInEth = formatEther(fiatInWei);

  return fiatInEth.toString();
};

export const SignEvmApprove = ({
  title,
  nativeAsset,
  transaction,
  tokenStandard = 'unknown',
  footer,
  containerStyles,
  isLoading = false,
  wallet,
  setGasConfig,
  onSign,
  onReject,
}: ISignEvmApproveProps) => {
  const { from, to, data, chainId } = transaction;
  const { dapp, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const showAlert = usePlatformAlert();
  const [txn, setTxn] = useState(transaction);

  const contract = to?.toLowerCase();
  // TokenAllowanceHandler only routes calls that decode to one of these methods.
  const call = useMemo(() => decodeCall(data) as AllowanceCall, [data]);
  const isErc20 = tokenStandard === 'erc20';
  // Plain ERC-20 approve keeps today's sentence and amount format; M06 owns changing them.
  const isPlainErc20Approve = isErc20 && call.method === 'approve';
  const grant = grantedAmount(call);

  const { tokenInfo, loading, error, clearError } = useTokenInfo({ contractAddress: isErc20 ? contract : '' });
  // useTokenInfo leaves `loading` set when every lookup fails, so an error ends loading here.
  const tokenLoading = loading && !error;
  const symbol = tokenInfo?.symbol ?? contract;

  const legacyAmountString = `${formatBigNumberForDisplay(formatUnits(grant, tokenInfo?.decimals || 18))} ${
    tokenInfo?.symbol
  }`;
  const amount = formatApprovalAmount(grant, tokenInfo?.decimals, tokenInfo?.symbol);
  const warning = allowanceWarning(call, tokenStandard, symbol, formatApprovalAmount(grant, tokenInfo?.decimals));

  let valueDisplay = amount.display;
  if (isPlainErc20Approve) valueDisplay = legacyAmountString;
  else if (tokenStandard === 'erc721') valueDisplay = `#${grant.toString()}`;
  else if (tokenStandard === 'unknown') valueDisplay = grant.toString();

  const {
    gasPrice,
    gasPrices,
    maxGasPrice,
    gasPriceWarning,
    gasFee,
    gasSpeedLabel,
    gasLimit,
    digits,
    setGasPrice,
    estimateGasFee,
  } = useExternalGasEstimate({
    type: TransactionType.TokenAllowance,
    transaction,
  });

  const {
    nativeBalance,
    erc20Balance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance({
    userAddress: from,
    contractAddress: isErc20 ? contract : undefined,
    chainId,
  });

  const isGasLoading = !gasPrices?.length;
  const defaultGasLimit = ethers.utils.hexlify(gasLimit);

  const feeInWei = ethers.utils.parseEther(gasFee.toFixed(18));
  const feeDisplay = formatBigNumberForDisplay(gasFee.toFixed(18));

  const feeString = `${feeDisplay} ${nativeAsset.symbol}`;

  const totalFiat = calculateFiat(feeInWei, nativeAsset);
  const totalDisplay = `$${formatBigNumberForDisplay(totalFiat, 2, 2)} USD`;

  // A decrease never needs more balance than the user has.
  const balanceAmount = call.method === 'decreaseAllowance' ? ethers.constants.Zero : grant;

  const validationResult = useMemo(() => {
    if (!nativeBalance || balanceLoading) {
      return { isValid: false, amountError: '', feeError: '' };
    }

    return validateBalance({
      nativeBalance,
      amount: balanceAmount,
      fee: feeInWei,
      type: TransactionType.TokenAllowance,
      tokenStandard,
      erc20Balance,
    });
  }, [nativeBalance, balanceAmount, feeInWei, balanceLoading]);

  const { isValid, amountError, feeError } = validationResult;

  const handleGasPriceChange = (_: any, val: number | number[]) => {
    let newGasPrice = Array.isArray(val) ? val[0] : val;
    newGasPrice = fixedNumber(newGasPrice, digits);
    setGasPrice(newGasPrice);
    estimateGasFee(newGasPrice);
  };

  useEffect(() => {
    if (gasPrice && gasLimit) {
      setGasConfig({ gasPrice: gasPrice.toString(), gasLimit: gasLimit.toString() });
      const defaultGasPrice = ethers.utils.parseUnits(gasPrice.toString(), 'gwei');
      setTxn({ ...txn, gas: transaction.gas || defaultGasLimit, gasPrice: defaultGasPrice._hex });
    }
  }, [gasPrice, gasLimit]);

  useEffect(() => {
    if (error) {
      showAlert(error, 'danger');
      clearError();
    }
  }, [error]);

  const gasSliderData = {
    prices: gasPrices,
    max: maxGasPrice,
    price: gasPrice,
    fee: gasFee,
    speedLabel: gasSpeedLabel,
    basePriceId: nativeAsset.priceId,
    symbol: nativeAsset.symbol,
    steps: smallestPowerOfTen(gasPrices[2]),
  };

  // A failed token lookup does not block signing: the decoded rows and warning still show.
  const isButtonDisabled = useMemo(
    () =>
      isLoading ||
      isGasLoading ||
      tokenLoading ||
      balanceLoading ||
      !!balanceError ||
      !isValid ||
      accountChanged ||
      networkChanged,
    [isLoading, isGasLoading, tokenLoading, isValid, balanceLoading, balanceError, accountChanged, networkChanged]
  );

  return (
    <CardLayoutV3
      logo={dapp.logo}
      title={title}
      subtitle={dapp.origin}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSign}
      positiveButtonLabel="Sign"
      isPositiveButtonLoading={isLoading}
      isPositiveButtonDisabled={isButtonDisabled}
      containerStyles={containerStyles}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
        </Card>
        <Card>
          {isErc20 && (tokenInfo || tokenLoading) ? (
            <CardRow.Token label="Token:" loading={tokenLoading} value={tokenInfo} />
          ) : (
            <CardRow.Address full label="Token:" value={contract} />
          )}
          {!isPlainErc20Approve && <CardRow label="Method:" value={METHOD_LABELS[call.method]} />}
          <CardRow label={VALUE_LABELS[tokenStandard]} loading={tokenLoading} value={valueDisplay} />
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
          {!!gasPriceWarning && <CardRow label="Warning:" value="" error={gasPriceWarning} />}
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          {call.method === 'permit' && <CardRow.Address full label="Owner:" value={call.owner} />}
          <CardRow.Address full label="Spender:" value={call.spender} />
          {call.method === 'permit' && <CardRow label="Deadline:" value={permitDeadline(call)} />}
        </Card>
        {!!warning && <ApprovalWarning severity={warning.severity}>{warning.text}</ApprovalWarning>}
        {tokenStandard === 'unknown' && (
          <ApprovalWarning severity="caution">
            This wallet could not determine the token type of this contract.
          </ApprovalWarning>
        )}
        {(isPlainErc20Approve || !!amountError) && (
          <Card>
            {tokenLoading ? (
              <div>
                <Skeleton variant="rect" animation="wave" height={17} width="100%" style={{ borderRadius: 4 }} />
                <Skeleton
                  variant="rect"
                  animation="wave"
                  height={17}
                  width="60%"
                  style={{ borderRadius: 4, marginTop: 6 }}
                />
              </div>
            ) : (
              <>
                {isPlainErc20Approve && (
                  <TextV3.CaptionRegular extraStyles={styles.description}>
                    Allow{' '}
                    <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
                      {ellipsis(contract)}
                    </TextV3.CaptionStrong>{' '}
                    to spend up to{' '}
                    <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
                      {legacyAmountString}
                    </TextV3.CaptionStrong>{' '}
                    from your wallet.
                  </TextV3.CaptionRegular>
                )}
                {!!amountError && (
                  <TextV3.CaptionStrong color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.LEFT}>
                    Important: {amountError}
                  </TextV3.CaptionStrong>
                )}
              </>
            )}
          </Card>
        )}
        {!isPlainErc20Approve && (
          <Card>
            <RawDataToggle label="Transaction data:" value={JSON.stringify(txn, null, 4)} />
          </Card>
        )}
        <div>
          <GasSlider gas={gasSliderData} loading={isGasLoading} onGasPriceChange={handleGasPriceChange} />
        </div>

        <Card>
          <CardRow label="Total:" loading={isGasLoading} value={totalDisplay} />
        </Card>

        {!!footer && (
          <TextV3.CaptionRegular color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.CENTER}>
            {footer}
          </TextV3.CaptionRegular>
        )}
      </div>
    </CardLayoutV3>
  );
};
