import { Skeleton } from '@material-ui/lab';
import { BigNumber, ethers } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useMemo } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useBalance } from 'hooks/external/useBalance';
import useExternalGasEstimate from 'hooks/external/useExternalGasEstimate';
import { useExternalViewData } from 'hooks/external/useExternalViewData';
import useTokenInfo from 'hooks/external/useTokenInfo';

import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import GasSlider from 'scenes/external/components/GasSlider';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import { TransactionType } from 'scenes/external/SignTransaction/types';
import { ellipsis } from 'scenes/home/helpers';

import { WalletParam } from 'scripts/Background/messaging';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { usePlatformAlert } from 'utils/alertUtil';
import { getERC20DataDecoder } from 'utils/ethUtil';
import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignEvmApproveProps {
  title: string;
  nativeAsset: IAssetInfoState | null;
  transaction: EthSendTransaction;
  footer?: string;
  containerStyles?: string;
  isLoading?: boolean;
  wallet: WalletParam;
  setGasConfig?: ({ gasPrice, gasLimit }: { gasPrice: string; gasLimit: string }) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const calculateFiat = (feeInWei: BigNumber, nativeAsset: IAssetInfoState) => {
  const { fiat } = store.getState().price;

  const assetPrice = fiat[nativeAsset.priceId]?.price || 0;
  const assetPriceInWei = ethers.utils.parseEther(assetPrice.toString());
  const divisor = ethers.utils.parseEther('1');

  const fiatInWei = feeInWei.mul(assetPriceInWei).div(divisor);
  const fiatInEth = formatEther(fiatInWei);

  return fiatInEth.toString();
};

export const SignEvmApprove = ({ title, nativeAsset, transaction, footer, containerStyles, isLoading = false, wallet, setGasConfig, onSign, onReject }: ISignEvmApproveProps) => {
  const { from, to, data, chainId } = transaction;
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const showAlert = usePlatformAlert();

  const dataDecoded = getERC20DataDecoder().decodeData(data);

  const contract = to?.toLowerCase();
  const spender = `0x${dataDecoded?.inputs[0]}`;

  const { tokenInfo, loading, error, clearError } = useTokenInfo({ contractAddress: contract });

  const amountInWei = BigNumber.from(dataDecoded?.inputs[1].toString());

  const amount = formatUnits(amountInWei, tokenInfo?.decimals || 18);
  const amountDisplay = formatBigNumberForDisplay(amount);

  const { gasPrice, gasPrices, gasFee, gasSpeedLabel, gasLimit, digits, setGasPrice, estimateGasFee } = useExternalGasEstimate({
    type: TransactionType.Erc20Approve,
    transaction,
  });

  const {
    nativeBalance,
    erc20Balance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance({
    userAddress: from,
    contractAddress: contract,
    chainId,
  });

  const isGasLoading = !gasPrices?.length;

  const feeInWei = ethers.utils.parseEther(gasFee.toFixed(18));
  const feeDisplay = formatBigNumberForDisplay(gasFee.toFixed(18));

  const amountString = `${amountDisplay} ${tokenInfo?.symbol}`;
  const feeString = `${feeDisplay} ${nativeAsset.symbol}`;

  const totalFiat = calculateFiat(feeInWei, nativeAsset);
  const totalDisplay = `$${formatBigNumberForDisplay(totalFiat, 2, 2)} USD`;

  const validationResult = useMemo(() => {
    if (!nativeBalance || balanceLoading) {
      return { isValid: false, amountError: '', feeError: '' };
    }

    return validateBalance({ nativeBalance, amount: amountInWei, fee: feeInWei, type: TransactionType.Erc20Approve, erc20Balance });
  }, [nativeBalance, amountInWei, feeInWei, balanceLoading]);

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
    price: gasPrice,
    fee: gasFee,
    speedLabel: gasSpeedLabel,
    basePriceId: nativeAsset.priceId,
    symbol: nativeAsset.symbol,
    steps: smallestPowerOfTen(gasPrices[2]),
  };

  const isButtonDisabled = useMemo(
    () => isLoading || isGasLoading || loading || !!error || balanceLoading || !!balanceError || !isValid || accountChanged || networkChanged,
    [isLoading, isGasLoading, loading, error, isValid, balanceLoading, balanceError, accountChanged, networkChanged]
  );

  return (
    <CardLayoutV3
      logo={current?.logo}
      title={title}
      subtitle={current?.origin}
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
          <CardRow.Token label="Token:" loading={loading} value={tokenInfo} />
          <CardRow label="Amount:" loading={loading} value={amountString} />
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          <CardRow.Address label="Spender:" value={spender} />
        </Card>
        <Card>
          {loading ? (
            <div>
              <Skeleton variant="rect" animation="wave" height={17} width="100%" style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" animation="wave" height={17} width="60%" style={{ borderRadius: 4, marginTop: 6 }} />
            </div>
          ) : (
            <>
              <TextV3.CaptionRegular extraStyles={styles.description}>
                Allow <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{ellipsis(contract)}</TextV3.CaptionStrong> to spend up to <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{amountString}</TextV3.CaptionStrong>{' '}
                from your wallet.
              </TextV3.CaptionRegular>
              {!!amountError && (
                <TextV3.CaptionStrong color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.LEFT}>
                  Important: {amountError}
                </TextV3.CaptionStrong>
              )}
            </>
          )}
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
