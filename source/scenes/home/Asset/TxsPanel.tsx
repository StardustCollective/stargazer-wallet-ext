import React, { FC, useCallback } from 'react';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';

import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType, Transaction } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import TxItem from './TxItem';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './Asset.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

interface ITxsPanel {
  address: string;
  transactions: Transaction[];
}

const TxsPanel: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const { activeNetwork, activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  // const account = accounts[activeAccountId];
  // const [scrollArea, setScrollArea] = useState<HTMLElement>();

  const isETH = activeAsset.type === AssetType.Ethereum || activeAsset.type === AssetType.ERC20;

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

  // const handleFetchMoreTxs = () => {
  //   if (transactions.length && !isETH) {
  //     const lastTx = [...transactions].pop();
  //     controller.wallet.account.updateTxs(10, lastTx.timestamp);
  //   }
  // };

  // const handleScroll = useCallback((ev) => {
  //   ev.persist();
  //   // setShowed(ev.target.scrollTop);
  //   if (ev.target.scrollTop) setShowed(true);
  //   setScrollArea(ev.target);
  //   const scrollOffset = ev.target.scrollHeight - ev.target.scrollTop;
  //   if (scrollOffset === ev.target.clientHeight) {
  //     handleFetchMoreTxs();
  //   }
  // }, []);

  const handleOpenExplorer = (tx?: string): boolean => {
    // If we don't have a tx ID then we can't link block explorer
    if (!tx) {
      return true;
    }

    const ethUrl = ETH_NETWORK[activeNetwork[KeyringNetwork.Ethereum]].etherscan;
    window.open(
      isETH ? `${ethUrl}tx/${tx}` : `${DAG_EXPLORER_SEARCH}${tx}`,
      '_blank'
    );
    
    return true;
  };

  // const handleGoTop = () => {
  //   scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
  //   setShowed(false);
  // };


  return (
    <div
      className={styles.activity}
    >
      {transactions.length ? (
        <div>
          {transactions.map((tx: Transaction, idx: number) => {
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
            const txTypeLabel = isReceived ? `${isETHPending ? tx.fromAddress
              : isETH
                ? tx.from && tx.from[0].from
                : tx.sender
              }`
              : `${isETHPending
                ? tx.toAddress
                : isETH
                  ? tx.to && tx.to[0].to
                  : tx.receiver
              }`
            const amount = isETH ? Number(isETHPending ? tx.amount : tx.balance).toFixed(4)
              : (tx.amount / 1e8).toFixed(4)
            const fiatAmount = isETH ? getFiatAmount(Number(isETHPending ? tx.amount : tx.balance), 2)
              : getFiatAmount(tx.amount / 1e8, 8)

            return (
                <TxItem
                  onItemClick={handleOpenExplorer}
                  tx={tx}
                  isETH={isETH}
                  isSelf={isSelf}
                  isReceived={isReceived}
                  isGasSettingsVisible={isETHPending && !isReceived}
                  showGroupBar={isShowedGroupBar(tx, idx)}
                  txTypeLabel={txTypeLabel}
                  currencySymbol={assets[activeAsset.id].symbol}
                  amount={amount}
                  fiatAmount={fiatAmount}
                />
            );
          })}
        </div>
  ) : (
    <div className={styles.noTx}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK}>
        {`You have no transaction history, send or receive $${assets[activeAsset.id].symbol
          } to register
            your first transaction.`}
      </TextV3.Caption>
    </div>
  )
}
    </div >
  );
};

export default TxsPanel;
