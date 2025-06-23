import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { BigNumber, ethers } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useMemo } from 'react';

import { ReactComponent as CypherockLogo } from 'assets/images/svg/cypherock-animated.svg';
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

import { WalletParam } from 'scripts/Background/messaging';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { usePlatformAlert } from 'utils/alertUtil';
import { getERC20DataDecoder } from 'utils/ethUtil';
import type { HardwareWalletType } from 'utils/hardware';
import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignEvmTransferProps {
  title: string;
  nativeAsset: IAssetInfoState | null;
  transaction: EthSendTransaction;
  footer?: string;
  origin?: string;
  containerStyles?: string;
  isLoading?: boolean;
  wallet: WalletParam;
  setGasConfig?: ({ gasPrice, gasLimit }: { gasPrice: string; gasLimit: string }) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const WALLET_LOGO: Record<HardwareWalletType, string | JSX.Element> = {
  [KeyringWalletType.CypherockAccountWallet]: <CypherockLogo className={styles.logo} />,
  [KeyringWalletType.BitfiAccountWallet]: '/assets/images/bitfi_logo.png',
};

const calculateErc20Total = (amountInWei: BigNumber, feeInWei: BigNumber, tokenInfo: any, nativeAsset: IAssetInfoState) => {
  const { fiat } = store.getState().price;

  const PRECISION = 18;
  let totalFiatWei = BigNumber.from(0);

  // Calculate token value in fiat if price is available
  if (tokenInfo && (tokenInfo.price || tokenInfo.priceId)) {
    const assetPrice = tokenInfo.price || fiat[tokenInfo.priceId]?.price || 0;

    if (assetPrice && assetPrice > 0) {
      const assetDecimals = tokenInfo.decimals || 18;

      const priceString = assetPrice.toFixed(PRECISION);
      const priceInWei = ethers.utils.parseUnits(priceString, PRECISION);
      const assetDivisor = ethers.utils.parseUnits('1', assetDecimals);

      const assetFiatValue = amountInWei.mul(priceInWei).div(assetDivisor);
      totalFiatWei = assetFiatValue;
    }
  }

  // Calculate fee value in fiat
  const feePrice = fiat[nativeAsset?.priceId]?.price || 0;

  if (!feePrice || feePrice <= 0) {
    return '0';
  }

  const feePriceString = feePrice.toFixed(PRECISION);
  const feePriceInWei = ethers.utils.parseEther(feePriceString);
  const feeDivisor = ethers.utils.parseEther('1');

  const feeFiatWei = feeInWei.mul(feePriceInWei).div(feeDivisor);

  totalFiatWei = totalFiatWei.add(feeFiatWei);
  const totalFiatEth = formatEther(totalFiatWei);

  return totalFiatEth.toString();
};

export const SignEvmTransferView = ({ title, nativeAsset, transaction, footer, origin, containerStyles, isLoading = false, wallet, setGasConfig, onSign, onReject }: ISignEvmTransferProps) => {
  const { from, to, data, chainId } = transaction;
  const fromDapp = origin !== 'stargazer-wallet';
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet, fromDapp);
  const showAlert = usePlatformAlert();

  const subtitle = fromDapp ? current.origin : null;
  const logo = fromDapp ? current.logo : WALLET_LOGO[activeWallet.type as HardwareWalletType];

  // Decode ERC20 transaction data
  const dataDecoded = getERC20DataDecoder().decodeData(data);
  const contractAddress = to?.toLowerCase();
  const recipientAddress = `0x${dataDecoded?.inputs[0]}`;
  const amountInWei = BigNumber.from(dataDecoded?.inputs[1]?.toString() || '0');

  // Get token information
  const { tokenInfo, loading: tokenLoading, error, clearError } = useTokenInfo({ contractAddress, withPrice: true });

  const { gasPrice, gasPrices, gasFee, gasSpeedLabel, gasLimit, digits, setGasPrice, estimateGasFee } = useExternalGasEstimate({
    type: TransactionType.Erc20Transfer,
    transaction,
  });

  const amountInEth = formatUnits(amountInWei, tokenInfo?.decimals || 18);
  const isGasLoading = !gasPrices.length;
  const feeInWei = ethers.utils.parseEther(gasFee.toFixed(18));

  const {
    nativeBalance,
    erc20Balance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance({
    userAddress: from,
    contractAddress,
    chainId,
  });

  const validationResult = useMemo(() => {
    if (!nativeBalance || balanceLoading) {
      return { isValid: false, amountError: '', feeError: '' };
    }

    return validateBalance({ nativeBalance, amount: amountInWei, fee: feeInWei, type: TransactionType.Erc20Transfer, erc20Balance });
  }, [nativeBalance, amountInWei, feeInWei, balanceLoading]);

  const { isValid, amountError, feeError } = validationResult;

  const amountDisplay = formatBigNumberForDisplay(amountInEth);
  const feeDisplay = formatBigNumberForDisplay(gasFee.toFixed(18));

  const amountString = `${amountDisplay} ${tokenInfo?.symbol}`;
  const feeString = `${feeDisplay} ${nativeAsset?.symbol}`;

  const totalFiat = calculateErc20Total(amountInWei, feeInWei, tokenInfo, nativeAsset);
  const totalDisplay = `$${formatBigNumberForDisplay(totalFiat, 2, 2)} USD`;

  const isButtonDisabled = useMemo(
    () => isLoading || isGasLoading || tokenLoading || !!error || balanceLoading || !!balanceError || !isValid || accountChanged || networkChanged,
    [isLoading, isGasLoading, tokenLoading, error, isValid, balanceLoading, balanceError, accountChanged, networkChanged]
  );

  const handleGasPriceChange = (_: any, val: number | number[]) => {
    let newGasPrice = Array.isArray(val) ? val[0] : val;
    newGasPrice = fixedNumber(newGasPrice, digits);
    setGasPrice(newGasPrice);
    estimateGasFee(newGasPrice);
  };

  useEffect(() => {
    if (gasPrice && gasLimit) {
      setGasConfig?.({ gasPrice: gasPrice.toString(), gasLimit: gasLimit.toString() });
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
    basePriceId: nativeAsset?.priceId,
    symbol: nativeAsset?.symbol,
    steps: smallestPowerOfTen(gasPrices[2]),
  };

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
      isPositiveButtonDisabled={isButtonDisabled}
      containerStyles={containerStyles}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
        </Card>
        <Card>
          <CardRow.Token label="Token:" loading={tokenLoading} value={tokenInfo} />
          <CardRow label="Amount:" loading={tokenLoading} value={amountString} error={amountError} />
          <CardRow label="Transaction fee:" loading={isGasLoading} value={feeString} error={feeError} />
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          {!!recipientAddress && <CardRow.Address label="To:" value={recipientAddress} />}
        </Card>

        <div>
          <GasSlider gas={gasSliderData} loading={isGasLoading} onGasPriceChange={handleGasPriceChange} />
        </div>

        <Card>
          <CardRow label="Max Total:" loading={isGasLoading || tokenLoading} value={totalDisplay} />
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
