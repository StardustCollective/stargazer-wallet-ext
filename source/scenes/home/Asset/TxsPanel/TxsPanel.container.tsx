import React, { FC, useCallback } from 'react';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';

import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType, Transaction } from 'state/vault/types';
import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';
import IAssetListState from 'state/assets/types';

import TxsPanel from './TxsPanel';
import TxItem from '../TxItem';
import { ITxsPanel } from './types';

const TxsPanelContainer: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const { activeNetwork, activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const isETH = activeAsset.type === AssetType.Ethereum || activeAsset.type === AssetType.ERC20;

  const isShowedGroupBar = useCallback(
    (tx: Transaction, idx: number) => {
      return (
        idx === 0 || new Date(tx.timestamp).toDateString() !== new Date(transactions[idx - 1].timestamp).toDateString()
      );
    },
    [transactions]
  );

  const getTxLink = (tx?: string): string | null => {
    // If we don't have a tx ID then we can't link block explorer
    if (!tx) {
      return null;
    }

    const ethUrl = ETH_NETWORK[activeNetwork[KeyringNetwork.Ethereum]].etherscan;
    return isETH ? `${ethUrl}tx/${tx}` : `${DAG_EXPLORER_SEARCH}${tx}`;
  };

  const renderTxItem = (tx: Transaction, idx: number) => {
    const isETHPending = isETH && tx.assetId === activeAsset.id;
    const isReceived =
      (!isETH && tx.receiver === address) ||
      (isETH && !tx.assetId && tx.to && tx.to[0].to.toLowerCase() === address.toLowerCase()) ||
      (isETHPending && tx.toAddress.toLowerCase() === address.toLowerCase());
    const isSent =
      (!isETH && tx.sender === address) ||
      (isETH && !tx.assetId && tx.from && tx.from[0].from.toLowerCase() === address.toLowerCase()) ||
      (isETHPending && tx.fromAddress.toLowerCase() === address.toLowerCase());
    const isSelf = isSent && isReceived;
    const txTypeLabel = isReceived
      ? `${isETHPending ? tx.fromAddress : isETH ? tx.from && tx.from[0].from : tx.sender}`
      : `${isETHPending ? tx.toAddress : isETH ? tx.to && tx.to[0].to : tx.receiver}`;
    const amount = isETH ? Number(isETHPending ? tx.amount : tx.balance) : tx.amount / 1e8;
    const amountString = formatStringDecimal(formatNumber(amount, 16, 20), 4);
    const fiatAmount = isETH
      ? getFiatAmount(Number(isETHPending ? tx.amount : tx.balance), 2)
      : getFiatAmount(tx.amount / 1e8, 8);

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
