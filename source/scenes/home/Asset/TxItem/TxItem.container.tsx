import React, { FC, ChangeEvent } from 'react';
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
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  fiatAmount,
  getLinkUrl,
}) => {
  const accountController = getAccountController();
  const minGasPrice = tx.gasPrice ? tx.gasPrice * 1.1 : 0;
  const { activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const { estimateGasFee, gasSpeedLabel, gasFee, setGasPrice, gasPrices, gasPrice } = useGasEstimate({
    toAddress: tx.toAddress,
    asset: assets[activeAsset.id],
    data: tx.data,
    gas: tx.gas,
  });

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  const onSpeedUpClick = async (gas: number) => {
    const txConfig: ITransactionInfo = {
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date().getTime(),
      ethConfig: {
        gasPrice: gas,
        gasLimit: 12313232,
        memo: tx.data,
        nonce: tx.nonce,
      },
    };

    accountController.updateTempTx(txConfig);
    accountController.confirmContractTempTx(activeAsset);
    await accountController.txController.removePendingTxHash(tx.txHash);
  };

  const receivedOrSentText = `${isSelf ? 'Self' : isReceived ? 'Received' : 'Sent'} ${currencySymbol}`;
  const formattedDistanceDate = formatDistanceDate(tx.timestamp);

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
        gasPrice={gasPrice}
      />
    );
  };

  return (
    <TxItem
      tx={tx}
      isETH={isETH}
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
    />
  );
};

export default TxItemContainer;
