import React, { FC, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';
import { DAG_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType, Reward, Transaction } from 'state/vault/types';
import { formatNumber, formatStringDecimal, getAddressURL } from 'scenes/home/helpers';
import IAssetListState from 'state/assets/types';
import { getAccountController } from 'utils/controllersUtils';
import TxsPanel from './TxsPanel';
import TxItem from '../TxItem';
import { ITxsPanel } from './types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { toDag } from 'utils/number';

const TxsPanelContainer: FC<ITxsPanel> = ({ route }) => {
  const getFiatAmount = useFiat();
  const { activeAsset, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const [transactions, setTransactions] = useState([]);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const accountController = getAccountController();
  const isL0token = !!assets[activeAsset?.id]?.l0endpoint;
  const address = activeAsset?.address;
  const isRewardsTab = route === 'rewards';
  const loading = activeAsset.loading;
  const isConstellationAsset = activeAsset?.type === AssetType.Constellation;
  const isLocalNetwork =
    isConstellationAsset && activeNetwork.Constellation === DAG_NETWORK.local2.id;

  useFocusEffect(
    useCallback(() => {
      if (!activeAsset) return;

      const fetchTxs = async () => {
        if (
          activeAsset?.type === AssetType.Constellation ||
          activeAsset?.type === AssetType.LedgerConstellation
        ) {
          if (isRewardsTab) {
            return activeAsset?.rewards;
          }
          return activeAsset?.transactions;
        }
        return (await accountController.getFullETHTxs()).sort(
          (a, b) => b.timestamp - a.timestamp
        );
      };

      fetchTxs().then((txns: any[]) => {
        setTransactions(txns);
      });
    }, [activeAsset])
  );

  const isETH =
    activeAsset.type === AssetType.Ethereum || activeAsset.type === AssetType.ERC20;

  const isShowedGroupBar = useCallback(
    (tx: Transaction, idx: number) => {
      const timestamp = isRewardsTab ? tx.accruedAt : tx.timestamp;
      const prevTimestamp = isRewardsTab
        ? transactions[idx - 1]?.accruedAt
        : transactions[idx - 1]?.timestamp;
      return (
        idx === 0 ||
        new Date(timestamp).toDateString() !== new Date(prevTimestamp).toDateString()
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
    if (!DAG_EXPLORER) return '';
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
      if (!explorerURL) {
        return '';
      }
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
      : toDag(tx.amount);
    const amountString = formatStringDecimal(formatNumber(amount, 16, 20), 4);
    const fiatAmount = isETH
      ? getFiatAmount(Number(isETHPending ? tx.amount : tx.balance), 2)
      : getFiatAmount(toDag(tx.amount), 2);

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

  const getRewardLink = (_?: any) => {
    return getAddressURL(
      activeAsset?.address,
      activeAsset?.contractAddress,
      activeAsset?.type,
      activeNetwork[KeyringNetwork.Constellation]
    );
  };

  const renderRewardItem = (tx: Reward, idx: number) => {
    const amount = toDag(tx.amount);
    const amountString = formatStringDecimal(formatNumber(amount, 16, 20), 4);
    const fiatAmount = getFiatAmount(amount, 2);
    const rewardsCount = tx?.rewardsCount ? tx.rewardsCount : null;
    return (
      <TxItem
        key={idx}
        getLinkUrl={getRewardLink}
        tx={tx}
        isETH={isETH}
        isSelf={false}
        isReceived
        isGasSettingsVisible={false}
        isRewardsTab={isRewardsTab}
        showGroupBar={isShowedGroupBar(tx, idx)}
        txTypeLabel={null}
        currencySymbol={assets[activeAsset?.id]?.symbol}
        amount={amountString}
        fiatAmount={fiatAmount}
        rewardsCount={rewardsCount}
      />
    );
  };

  const TRANSACTION_DESCRIPTION = isLocalNetwork
    ? 'Transaction history not available for Local Networks'
    : 'You don’t have any transactions for this token yet!';
  const REWARDS_DESCRIPTION = isLocalNetwork
    ? 'Reward history not available for Local Networks'
    : 'No rewards earned';
  const renderItem = isRewardsTab ? renderRewardItem : renderTxItem;
  const description = isRewardsTab ? REWARDS_DESCRIPTION : TRANSACTION_DESCRIPTION;

  return (
    <TxsPanel
      transactions={transactions}
      renderTxItem={renderItem}
      transactionDescription={description}
      loading={loading}
    />
  );
};

export default TxsPanelContainer;
