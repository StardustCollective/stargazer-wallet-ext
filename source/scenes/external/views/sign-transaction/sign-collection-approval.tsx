import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useBalance } from 'hooks/external/useBalance';
import useExternalGasEstimate from 'hooks/external/useExternalGasEstimate';
import { useExternalViewData } from 'hooks/external/useExternalViewData';

import ApprovalWarning from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import GasSlider from 'scenes/external/components/GasSlider';
import RawDataToggle from 'scenes/external/components/RawDataToggle';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import { TransactionType } from 'scenes/external/SignTransaction/types';

import { WalletParam } from 'scripts/Background/messaging';
import { decodeCall, type DecodedCall } from 'scripts/Provider/evm/utils/decodeCall';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import type { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

import { fixedNumber, formatBigNumberForDisplay, smallestPowerOfTen } from 'utils/number';

import styles from './styles.scss';
import { validateBalance } from './utils';

export interface ISignCollectionApprovalProps {
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

export const SignCollectionApproval = ({
  title,
  nativeAsset,
  transaction,
  footer,
  containerStyles,
  isLoading = false,
  wallet,
  setGasConfig,
  onSign,
  onReject,
}: ISignCollectionApprovalProps) => {
  const { dapp, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const [txn, setTxn] = useState(transaction);

  const { from, to, data, chainId } = transaction;
  // CollectionApprovalHandler only routes calls that decode to setApprovalForAll.
  const { operator, approved } = useMemo(
    () => decodeCall(data) as Extract<DecodedCall, { method: 'setApprovalForAll' }>,
    [data]
  );

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
    type: TransactionType.CollectionApproval,
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

    return validateBalance({ nativeBalance, fee: feeInWei, type: TransactionType.CollectionApproval });
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
    () => isLoading || isGasLoading || balanceLoading || !!balanceError || !isValid || accountChanged || networkChanged,
    [isLoading, isGasLoading, balanceLoading, balanceError, isValid, accountChanged, networkChanged]
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
          <CardRow.Address full label="Collection:" value={to} />
          <CardRow.Address full label="Operator:" value={operator} />
          <CardRow label="Approved:" value={approved ? 'Yes' : 'No'} />
        </Card>
        {approved && (
          <ApprovalWarning severity="danger">{`This lets ${operator} transfer ALL your NFTs in this collection without further confirmation.`}</ApprovalWarning>
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
