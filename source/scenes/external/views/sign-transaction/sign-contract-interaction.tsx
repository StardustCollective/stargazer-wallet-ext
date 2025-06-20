import { Skeleton } from '@material-ui/lab';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useBalance } from 'hooks/external/useBalance';
import useExternalGasEstimate from 'hooks/external/useExternalGasEstimate';
import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import GasSlider from 'scenes/external/components/GasSlider';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import { TransactionType } from 'scenes/external/SignTransaction/types';

import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignContractInteractionProps {
  title: string;
  nativeAsset: IAssetInfoState | null;
  transaction: EthSendTransaction;
  footer?: string;
  containerStyles?: string;
  isLoading?: boolean;
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

export const SignContractInteraction = ({ title, nativeAsset, transaction, footer, containerStyles, isLoading = false, setGasConfig, onSign, onReject }: ISignContractInteractionProps) => {
  const { current, activeWallet, evmNetwork } = useExternalViewData();
  const [txn, setTxn] = useState(transaction);

  const { from, chainId } = transaction;

  const { gasPrice, gasPrices, gasFee, gasSpeedLabel, gasLimit, digits, setGasPrice, estimateGasFee } = useExternalGasEstimate({
    type: TransactionType.EvmContractInteraction,
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

    return validateBalance({ nativeBalance, fee: feeInWei, type: TransactionType.EvmContractInteraction });
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
    price: gasPrice,
    fee: gasFee,
    speedLabel: gasSpeedLabel,
    basePriceId: nativeAsset.priceId,
    symbol: nativeAsset.symbol,
    steps: smallestPowerOfTen(gasPrices[2]),
  };

  const isButtonDisabled = useMemo(() => isLoading || isGasLoading || balanceLoading || !!balanceError || !isValid, [isLoading, isGasLoading, balanceLoading, balanceError, isValid]);

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
          <CardRow label="Account:" value={activeWallet?.label} />
          <CardRow label="Network:" value={evmNetwork} />
        </Card>
        <Card>
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
        </Card>

        <Card>
          {isGasLoading ? (
            <>
              <Skeleton variant="rect" width="100%" height={30} style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" width="100%" height={30} style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" width="100%" height={30} style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" width="100%" height={30} style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" width="100%" height={30} style={{ borderRadius: 4 }} />
            </>
          ) : (
            <CardRow.Object label="Transaction data:" value={JSON.stringify(txn, null, 4)} />
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
