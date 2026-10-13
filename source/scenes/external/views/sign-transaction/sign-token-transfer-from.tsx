import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useBalance } from 'hooks/external/useBalance';
import useExternalGasEstimate from 'hooks/external/useExternalGasEstimate';
import { useExternalViewData } from 'hooks/external/useExternalViewData';
import useTokenInfo from 'hooks/external/useTokenInfo';

import ApprovalWarning from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import GasSlider from 'scenes/external/components/GasSlider';
import RawDataToggle from 'scenes/external/components/RawDataToggle';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import { type TokenStandard, TransactionType } from 'scenes/external/SignTransaction/types';

import { WalletParam } from 'scripts/Background/messaging';
import { decodeCall, type DecodedCall } from 'scripts/Provider/evm/utils/decodeCall';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { formatApprovalAmount } from 'utils/approvalAmount';
import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignTokenTransferFromProps {
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

type TransferFromCall = Extract<
  DecodedCall,
  { method: 'transferFrom' | 'safeTransferFrom721' | 'safeTransferFrom1155' }
>;

// What moves: the value rows, and the noun the danger warning uses.
const describeTransfer = (
  call: TransferFromCall,
  tokenStandard: TokenStandard,
  erc20Amount: string
): { rows: Array<{ label: string; value: string }>; subject: string } => {
  if (call.method === 'safeTransferFrom1155') {
    const rows = call.ids.map((id, i) => ({
      label: 'Token ID:',
      value: `#${id.toString()} (amount ${call.amounts[i].toString()})`,
    }));
    const subject =
      call.ids.length === 1
        ? `token #${call.ids[0].toString()}`
        : `tokens ${call.ids.map(id => `#${id.toString()}`).join(', ')}`;
    return { rows, subject };
  }

  const id = call.method === 'transferFrom' ? call.amountOrId : call.tokenId;

  if (call.method === 'safeTransferFrom721' || tokenStandard === 'erc721') {
    return { rows: [{ label: 'Token ID:', value: `#${id.toString()}` }], subject: `token #${id.toString()}` };
  }

  if (tokenStandard === 'erc20') {
    return { rows: [{ label: 'Amount:', value: erc20Amount }], subject: erc20Amount };
  }

  return { rows: [{ label: 'Amount or token ID:', value: id.toString() }], subject: 'tokens' };
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

export const SignTokenTransferFrom = ({
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
}: ISignTokenTransferFromProps) => {
  const { dapp, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const [txn, setTxn] = useState(transaction);

  const { from, to, data, chainId } = transaction;
  // TokenTransferFromHandler only routes calls that decode to one of these methods.
  const call = useMemo(() => decodeCall(data) as TransferFromCall, [data]);
  const isErc20 = tokenStandard === 'erc20';

  const { tokenInfo, loading, error } = useTokenInfo({ contractAddress: isErc20 ? to.toLowerCase() : '' });
  // useTokenInfo leaves `loading` set when every lookup fails, so an error ends loading here.
  const tokenLoading = loading && !error;
  const erc20Amount =
    call.method === 'transferFrom'
      ? formatApprovalAmount(call.amountOrId, tokenInfo?.decimals, tokenInfo?.symbol).display
      : '';
  const { rows, subject } = describeTransfer(call, tokenStandard, erc20Amount);
  // eth_sendTransaction only accepts transactions from the active account, so `from` is the user.
  const movesOwnTokens = ethers.utils.getAddress(call.from) === ethers.utils.getAddress(from);

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
    type: TransactionType.TokenTransferFrom,
    transaction,
  });

  const {
    nativeBalance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance({
    userAddress: from,
    chainId,
  });

  const isGasLoading = !gasPrices?.length;
  const defaultGasLimit = ethers.utils.hexlify(gasLimit);

  const feeInWei = ethers.utils.parseEther(gasFee.toFixed(18));
  const feeDisplay = formatBigNumberForDisplay(gasFee.toFixed(18));

  const feeString = `${feeDisplay} ${nativeAsset.symbol}`;

  const totalFiat = calculateFiat(feeInWei, nativeAsset);
  const totalDisplay = `$${formatBigNumberForDisplay(totalFiat, 2, 2)} USD`;

  const validationResult = useMemo(() => {
    if (!nativeBalance || balanceLoading) {
      return { isValid: false, amountError: '', feeError: '' };
    }

    return validateBalance({ nativeBalance, fee: feeInWei, type: TransactionType.TokenTransferFrom });
  }, [nativeBalance, feeInWei, balanceLoading]);

  const { isValid, feeError } = validationResult;

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
    [isLoading, isGasLoading, tokenLoading, balanceLoading, balanceError, isValid, accountChanged, networkChanged]
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
            <CardRow.Address full label="Token:" value={to} />
          )}
          <CardRow.Address full label="From:" value={call.from} />
          <CardRow.Address full label="To:" value={call.to} />
          {rows.map(row => (
            <CardRow
              key={`${row.label}-${row.value}`}
              label={row.label}
              loading={isErc20 && tokenLoading}
              value={row.value}
            />
          ))}
        </Card>
        {movesOwnTokens ? (
          <ApprovalWarning severity="danger">{`This moves your ${subject} to ${call.to}.`}</ApprovalWarning>
        ) : (
          <ApprovalWarning severity="caution">{`This moves tokens from ${call.from}, which is not your account.`}</ApprovalWarning>
        )}
        {tokenStandard === 'unknown' && (
          <ApprovalWarning severity="caution">
            This wallet could not determine the token type of this contract.
          </ApprovalWarning>
        )}
        <Card>
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
          {!!gasPriceWarning && <CardRow label="Warning:" value="" error={gasPriceWarning} />}
        </Card>
        <Card>
          <RawDataToggle label="Transaction data:" value={JSON.stringify(txn, null, 4)} />
        </Card>
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
