import React, { FC, ChangeEvent, useState } from 'react';
import IVaultState from 'state/vault/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IAssetListState from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';
import { getAccountController } from 'utils/controllersUtils';
import useGasEstimate from 'hooks/useGasEstimate';
import TxItem from './TxItem';
import GasSettings from '../GasSettings';
import { formatDistanceDate } from '../../helpers';
import { ITxItem } from './types';

const MAX_GAS_NUMBER = 200;

const TxItemContainer: FC<ITxItem> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isRewardsTab,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  rewardsCount,
  fiatAmount,
  getLinkUrl,
}) => {
  const accountController = getAccountController();
  const minGasPrice = tx.gasPrice ? tx.gasPrice * 1.1 : 0;
  const { activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);
  const [cancelError, setCancelError] = useState('');

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const { estimateGasFee, gasSpeedLabel, gasFee, setGasPrice, gasPrices, gasPrice } =
    useGasEstimate({
      toAddress: tx.toAddress,
      asset: assets[activeAsset.id],
      data: tx.data,
      gas: tx.gas,
    });

  const onGasPriceChanged = (_event: ChangeEvent<any>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  const onSpeedUpClick = async (gas: number) => {
    const newGasLimit = tx.gasLimit ? Math.round(tx.gasLimit * 1.3) : 21000;
    const txConfig: ITransactionInfo = {
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date().getTime(),
      ethConfig: {
        gasPrice: gas,
        gasLimit: newGasLimit,
        memo: tx.data,
        nonce: tx.nonce,
      },
    };

    await accountController.updateTempTx(txConfig);
    await accountController.confirmContractTempTx(activeAsset);
    await accountController.txController.removePendingTxHash(tx.txHash);
  };

  const onCancelClick = async () => {
    const newGasLimit = tx.gasLimit ? Math.round(tx.gasLimit * 1.2) : 21000;
    const txConfig: ITransactionInfo = {
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: '0', // We need to send a 0 ETH (or any ERC-20 token) transaction in order to cancel the previous one
      timestamp: new Date().getTime(),
      ethConfig: {
        gasPrice: Math.round(tx.gasPrice * 1.3), // Gas price increased by 30%
        gasLimit: newGasLimit,
        memo: tx.data,
        nonce: tx.nonce,
      },
    };

    try {
      await accountController.updateTempTx(txConfig);
      await accountController.confirmContractTempTx(activeAsset);
      await accountController.txController.removePendingTxHash(tx.txHash);
    } catch (err) {
      setCancelError('Error cancelling transaction');
    }
  };

  const receivedOrSentText = `${
    isSelf ? 'Self' : isReceived ? 'Received' : 'Sent'
  } ${currencySymbol}`;
  const timestamp = isRewardsTab ? tx.accruedAt : tx.timestamp;
  const formattedDistanceDate = formatDistanceDate(timestamp);

  const renderGasSettings = () => {
    return (
      <GasSettings
        values={{
          min: minGasPrice,
          max: MAX_GAS_NUMBER,
          current: gasPrice,
        }}
        gasPrices={gasPrices}
        speedLabel={gasSpeedLabel}
        gasFeeLabel={gasFee}
        onSliderChange={onGasPriceChanged}
        onSpeedUpClick={onSpeedUpClick}
        onCancelClick={onCancelClick}
        gasPrice={gasPrice}
        cancelError={cancelError}
      />
    );
  };

  return (
    <TxItem
      tx={tx}
      isETH={isETH}
      isRewardsTab={isRewardsTab}
      isSelf={isSelf}
      isReceived={isReceived}
      isGasSettingsVisible={isGasSettingsVisible}
      showGroupBar={showGroupBar}
      txTypeLabel={txTypeLabel}
      currencySymbol={currencySymbol}
      amount={amount}
      fiatAmount={fiatAmount}
      getLinkUrl={getLinkUrl}
      receivedOrSentText={receivedOrSentText}
      formattedDistanceDate={formattedDistanceDate}
      renderGasSettings={renderGasSettings}
      logo={assets[activeAsset.id]?.logo}
      rewardsCount={rewardsCount}
    />
  );
};

export default TxItemContainer;
