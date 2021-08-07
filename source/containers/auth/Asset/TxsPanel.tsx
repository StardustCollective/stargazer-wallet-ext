import React, { FC, Fragment, useCallback, useState } from 'react';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import LinkIcon from '@material-ui/icons/OpenInNewOutlined';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '@material-ui/core/CircularProgress';

import { useController } from 'hooks/index';
import { formatDistanceDate } from '../helpers';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType, Transaction } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

import styles from './Asset.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

interface ITxsPanel {
  address: string;
  transactions: Transaction[];
}

const TxsPanel: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const controller = useController();
  const [isShowed, setShowed] = useState<boolean>(false);
  const { activeNetwork, activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  // const account = accounts[activeAccountId];
  const [scrollArea, setScrollArea] = useState<HTMLElement>();

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

  const handleFetchMoreTxs = () => {
    if (transactions.length && !isETH) {
      const lastTx = [...transactions].pop();
      controller.wallet.account.updateTxs(10, lastTx.timestamp);
    }
  };

  const handleScroll = useCallback((ev) => {
    ev.persist();
    // setShowed(ev.target.scrollTop);
    if (ev.target.scrollTop) setShowed(true);
    setScrollArea(ev.target);
    const scrollOffset = ev.target.scrollHeight - ev.target.scrollTop;
    if (scrollOffset === ev.target.clientHeight) {
      handleFetchMoreTxs();
    }
  }, []);

  const handleOpenExplorer = (tx: string) => {
    const ethUrl = ETH_NETWORK[activeNetwork[KeyringNetwork.Ethereum]].etherscan;
    window.open(
      isETH ? `${ethUrl}tx/${tx}` : `${DAG_EXPLORER_SEARCH}${tx}`,
      '_blank'
    );
  };

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
  };

  const renderIcon = (isReceived: boolean, tx: any) => {
    if (!isETH) {
      return (
        <>
          {tx.checkpointBlock ? (
            isReceived ? (
              <DoubleArrowIcon className={styles.recvIcon} />
            ) : (
              <DoubleArrowIcon />
            )
          ) : (
            <Spinner size={16} className={styles.spinner} />
          )}
        </>
      );
    }
    return (
      <>
        {!tx.assetId ? (
          isReceived ? (
            <DoubleArrowIcon className={styles.recvIcon} />
          ) : (
            <DoubleArrowIcon />
          )
        ) : (
          <Spinner size={16} className={styles.spinner} />
        )}
      </>
    );
  };

  return (
    <section
      className={clsx(styles.activity, { [styles.expanded]: isShowed })}
      onScroll={handleScroll}
    >
      <div className={styles.heading}>
        Activity
        {!!isShowed && (
          <IconButton className={styles.goTop} onClick={handleGoTop}>
            <GoTopIcon />
          </IconButton>
        )}
      </div>
      {transactions.length ? (
        <>
          <ul>
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

              return (
                <Fragment key={uuid()}>
                  {isShowedGroupBar(tx, idx) && (
                    <li className={styles.groupbar}>
                      {formatDistanceDate(tx.timestamp)}
                    </li>
                  )}
                  <li
                    onClick={() =>
                      handleOpenExplorer(isETHPending ? tx.txHash : tx.hash)
                    }
                  >
                    <div>
                      <div className={styles.iconWrapper}>
                        {renderIcon(isReceived && !isSelf, tx)}
                      </div>
                      <span>
                        {isSelf ? 'Self' : (isReceived ? 'Received' : 'Sent')}
                        {!isSelf && (
                          <small>
                            {isReceived
                              ? `From: ${
                                isETHPending
                                  ? tx.fromAddress
                                  : isETH
                                    ? tx.from && tx.from[0].from
                                    : tx.sender
                              }`
                              : `To: ${
                                isETHPending
                                  ? tx.toAddress
                                  : isETH
                                    ? tx.to && tx.to[0].to
                                    : tx.receiver
                              }`}
                          </small>
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        <span>
                          {isETH
                            ? Number(
                                isETHPending ? tx.amount : tx.balance
                              ).toFixed(4)
                            : tx.amount / 1e8}{' '}
                          <b>{assets[activeAsset.id].symbol}</b>
                        </span>
                        <small>
                          {isETH
                            ? getFiatAmount(
                                Number(isETHPending ? tx.amount : tx.balance),
                                2
                              )
                            : getFiatAmount(tx.amount / 1e8, 8)}
                        </small>
                      </span>
                      <div className={styles.linkIcon}>
                        <LinkIcon />
                      </div>
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <span className={styles.noTxComment}>
            {`You have no transaction history, send or receive $${
              assets[activeAsset.id].symbol
            } to register
            your first transaction.`}
          </span>
          <img
            src={StargazerIcon}
            className={styles.stargazer}
            alt="stargazer"
            height="167"
            width="auto"
          />
        </>
      )}
    </section>
  );
};

export default TxsPanel;
