import React, { FC, useCallback } from 'react';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';
import { DAG_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType, Transaction } from 'state/vault/types';
import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';
import IAssetListState from 'state/assets/types';

import TxsPanel from './TxsPanel';
import TxItem from '../TxItem';
import { ITxsPanel } from './types';
import { getAccountController } from 'utils/controllersUtils';

const TxsPanelContainer: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const { activeAsset, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const accountController = getAccountController();
  const isL0token = !!assets[activeAsset?.id]?.l0endpoint;

  const isETH =
    activeAsset.type === AssetType.Ethereum || activeAsset.type === AssetType.ERC20;

  const isShowedGroupBar = useCallback(
    (tx: Transaction, idx: number) => {
      return (
        idx === 0 ||
        new Date(tx.timestamp).toDateString() !==
          new Date(transactions[idx - 1].timestamp).toDateString()
      );
    },
    [transactions]
  );

  const getTxLink = (tx?: any): string | null => {
    // If we don't have a tx ID then we can't link block explorer
    const txHash = tx.hash;
    if (!txHash) {
      return null;
    }
    const DAG_OBJECT = DAG_NETWORK[activeNetwork.Constellation];

    if (!DAG_OBJECT) return '';
    let DAG_EXPLORER = DAG_OBJECT?.explorer;
    // tx.sender is only available on txs in Mainnet 1.0
    if (tx.sender) {
      DAG_EXPLORER = 'https://mainnet1.dagexplorer.io';
    }
    let DAG_EXPLORER_TX = `${DAG_EXPLORER}/transactions`;

    if (isL0token) {
      const assetAddress = activeAsset.contractAddress;
      DAG_EXPLORER_TX = `${DAG_EXPLORER}/metagraphs/${assetAddress}/transactions`;
    }

    let explorerURL = '';
    if (isETH) {
      if (!accountController?.networkController) {
        return '';
      }
      explorerURL = accountController?.networkController?.getExplorerURL();
      if (!explorerURL) return '';
    }
    return isETH ? `${explorerURL}tx/${txHash}` : `${DAG_EXPLORER_TX}/${txHash}`;
  };

  const renderTxItem = (tx: Transaction, idx: number) => {
    const isETHPending = isETH && tx.assetId === activeAsset.id;
    // tx.receiver and tx.sender are from Transaction V1
    // tx.destination and tx.source are from Transaction V2
    const dagTxSender = tx.sender ? tx.sender : tx.source;
    const dagTxReceiver = tx.receiver ? tx.receiver : tx.destination;
    const isReceived =
      (!isETH && [tx.receiver, tx.destination].includes(address)) ||
      (isETH &&
        !tx.assetId &&
        tx.to &&
        tx.to[0].to.toLowerCase() === address.toLowerCase()) ||
      (isETHPending && tx.toAddress.toLowerCase() === address.toLowerCase());
    const isSent =
      (!isETH && [tx.sender, tx.source].includes(address)) ||
      (isETH &&
        !tx.assetId &&
        tx.from &&
        tx.from[0].from.toLowerCase() === address.toLowerCase()) ||
      (isETHPending && tx.fromAddress.toLowerCase() === address.toLowerCase());
    const isSelf = isSent && isReceived;
    const txTypeLabel = isReceived
      ? `${
          isETHPending ? tx.fromAddress : isETH ? tx.from && tx.from[0].from : dagTxSender
        }`
      : `${isETHPending ? tx.toAddress : isETH ? tx.to && tx.to[0].to : dagTxReceiver}`;
    const amount = isETH
      ? Number(isETHPending ? tx.amount : tx.balance)
      : tx.amount / 1e8;
    const amountString = formatStringDecimal(formatNumber(amount, 16, 20), 4);
    const fiatAmount = isETH
      ? getFiatAmount(Number(isETHPending ? tx.amount : tx.balance), 2)
      : getFiatAmount(tx.amount / 1e8, 4);

    return (
      <TxItem
        key={idx}
        getLinkUrl={getTxLink}
        tx={tx}
        isETH={isETH}
        isSelf={isSelf}
        isReceived={isReceived}
        isGasSettingsVisible={isETHPending && (!isReceived || isSelf)}
        showGroupBar={isShowedGroupBar(tx, idx)}
        txTypeLabel={txTypeLabel}
        currencySymbol={assets[activeAsset?.id]?.symbol}
        amount={amountString}
        fiatAmount={fiatAmount}
        isL0token={isL0token}
      />
    );
  };

  const TRANSACTION_DESCRIPTION = `You have no transaction history, send or receive $${
    assets[activeAsset?.id]?.symbol
  } to register your first transaction.`;

  return (
    <TxsPanel
      transactions={transactions}
      renderTxItem={renderTxItem}
      transactionDescription={TRANSACTION_DESCRIPTION}
    />
  );
};

export default TxsPanelContainer;
