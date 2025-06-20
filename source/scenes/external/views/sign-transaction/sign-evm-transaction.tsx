import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useCallback, useEffect, useMemo } from 'react';

import { ReactComponent as CypherockLogo } from 'assets/images/svg/cypherock-animated.svg';
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

import type { HardwareWalletType } from 'utils/hardware';
import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignEvmTransactionProps {
  title: string;
  nativeAsset: IAssetInfoState | null;
  transaction: EthSendTransaction;
  footer?: string;
  origin?: string;
  containerStyles?: string;
  isLoading?: boolean;
  setGasConfig?: ({ gasPrice, gasLimit }: { gasPrice: string; gasLimit: string }) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const WALLET_LOGO: Record<HardwareWalletType, string | JSX.Element> = {
  [KeyringWalletType.CypherockAccountWallet]: <CypherockLogo className={styles.logo} />,
  [KeyringWalletType.BitfiAccountWallet]: '/assets/images/bitfi_logo.png',
};

const calculateNativeTotal = (amountInWei: BigNumber, feeInWei: BigNumber, nativeAsset: IAssetInfoState) => {
  const { fiat } = store.getState().price;

  const totalInWei = amountInWei.add(feeInWei);

  const assetPrice = fiat[nativeAsset.priceId]?.price || 0;
  const assetPriceInWei = ethers.utils.parseEther(assetPrice.toString());
  const divisor = ethers.utils.parseEther('1');

  const fiatInWei = totalInWei.mul(assetPriceInWei).div(divisor);
  const fiatInEth = formatEther(fiatInWei);

  return fiatInEth.toString();
};

export const SignEvmTransactionView = ({ title, nativeAsset, transaction, origin, footer, containerStyles, isLoading = false, setGasConfig, onSign, onReject }: ISignEvmTransactionProps) => {
  const { current, activeWallet, evmNetwork } = useExternalViewData();
  const { from, to, value: amount, chainId } = transaction;

  const fromDapp = origin !== 'stargazer-wallet';
  const subtitle = fromDapp ? current.origin : null;
  const logo = fromDapp ? current.logo : WALLET_LOGO[activeWallet.type as HardwareWalletType];

  const amountInWei = BigNumber.from(amount ?? 0);
  const amountInEth = formatEther(amountInWei);

  const { gasPrice, gasPrices, gasFee, gasSpeedLabel, gasLimit, digits, setGasPrice, estimateGasFee } = useExternalGasEstimate({
    type: TransactionType.EvmNative,
    transaction,
  });

  const isGasLoading = !gasPrices.length;
  const feeInWei = ethers.utils.parseEther(gasFee.toFixed(18));

  const {
    nativeBalance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance({
    userAddress: from,
    chainId,
  });

  const validationResult = useMemo(() => {
    if (!nativeBalance || balanceLoading) {
      return { isValid: false, amountError: '', feeError: '' };
    }

    return validateBalance({ nativeBalance, amount: amountInWei, fee: feeInWei, type: TransactionType.EvmNative });
  }, [nativeBalance, amountInWei, feeInWei, balanceLoading]);

  const { isValid, amountError, feeError } = validationResult;

  const amountDisplay = formatBigNumberForDisplay(amountInEth);
  const feeDisplay = formatBigNumberForDisplay(gasFee.toFixed(18));

  const amountString = `${amountDisplay} ${nativeAsset?.symbol}`;
  const feeString = `${feeDisplay} ${nativeAsset?.symbol}`;

  const totalFiat = calculateNativeTotal(amountInWei, feeInWei, nativeAsset);
  const totalDisplay = `$${formatBigNumberForDisplay(totalFiat, 2, 2)} USD`;

  const handleGasPriceChange = useCallback(
    (_: any, val: number | number[]) => {
      let newGasPrice = Array.isArray(val) ? val[0] : val;
      newGasPrice = fixedNumber(newGasPrice, digits);
      setGasPrice(newGasPrice);
      estimateGasFee(newGasPrice);
    },
    [digits]
  );

  useEffect(() => {
    if (gasPrice && gasLimit) {
      setGasConfig?.({ gasPrice: gasPrice.toString(), gasLimit: gasLimit.toString() });
    }
  }, [gasPrice, gasLimit]);

  const gasSliderData = {
    prices: gasPrices,
    price: gasPrice,
    fee: gasFee,
    speedLabel: gasSpeedLabel,
    basePriceId: nativeAsset?.priceId,
    symbol: nativeAsset?.symbol,
    steps: smallestPowerOfTen(gasPrices[2]),
  };

  const tokenValue = { logo: nativeAsset?.logo, symbol: nativeAsset?.symbol };

  return (
    <CardLayoutV3
      logo={logo}
      title={title}
      subtitle={subtitle}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSign}
      positiveButtonLabel="Sign"
      isPositiveButtonLoading={isLoading}
      isPositiveButtonDisabled={isLoading || isGasLoading || balanceLoading || !isValid || !!balanceError}
      containerStyles={containerStyles}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} />
          <CardRow label="Network:" value={evmNetwork} />
        </Card>
        <Card>
          <CardRow.Token label="Token:" value={tokenValue} />
          <CardRow label="Amount:" value={amountString} error={amountError} />
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          {!!to && <CardRow.Address label="To:" value={to} />}
        </Card>

        <div>
          <GasSlider gas={gasSliderData} loading={isGasLoading} onGasPriceChange={handleGasPriceChange} />
        </div>

        <Card>
          <CardRow label="Max Total:" loading={isGasLoading} value={totalDisplay} />
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
