import React, { FC, Fragment, useCallback, useState } from 'react';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import { useFiat } from 'hooks/usePrice';
import { useSelector } from 'react-redux';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import DownArrowIcon from '@material-ui/icons/ArrowDownward';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '@material-ui/core/CircularProgress';

import { useController } from 'hooks/index';
import { formatDistanceDate } from '../helpers';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import { RootState } from 'state/store';
import IWalletState, { Transaction } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';

import styles from './Asset.scss';

interface ITxsPanel {
  address: string;
  transactions: Transaction[];
}

const TxsPanel: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const controller = useController();
  const [isShowed, setShowed] = useState<boolean>(false);
  const isETHTx = !controller.wallet.account.isValidDAGAddress(address);
  const {
    activeNetwork,
    accounts,
    activeAccountId,
  }: IWalletState = useSelector((state: RootState) => state.wallet);
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];
  const [scrollArea, setScrollArea] = useState<HTMLElement>();

  const isShowedGroupBar = useCallback(
    (tx: Transaction, idx: number) => {
      return (
        idx === 0 ||
        new Date(isETHTx ? tx.date : tx.timestamp).toDateString() !==
          new Date(
            isETHTx
              ? transactions[idx - 1].date
              : transactions[idx - 1].timestamp
          ).toDateString()
      );
    },
    [transactions]
  );

  const handleFetchMoreTxs = () => {
    if (transactions.length) {
      const lastTx = [...transactions].pop();
      controller.wallet.account.updateTxs(10, lastTx?.timestamp);
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
    const ethUrl = ETH_NETWORK[activeNetwork[account.activeAssetId]].etherscan;
    window.open(
      isETHTx ? `${ethUrl}tx/${tx}` : `${DAG_EXPLORER_SEARCH}${tx}`,
      '_blank'
    );
  };

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
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
              const isRecived =
                (isETHTx && tx.to[0].to === address) ||
                (!isETHTx && tx.receiver === address);

              return (
                <Fragment key={uuid()}>
                  {isShowedGroupBar(tx, idx) && (
                    <li className={styles.groupbar}>
                      {formatDistanceDate(isETHTx ? tx.date : tx.timestamp)}
                    </li>
                  )}
                  <li onClick={() => handleOpenExplorer(tx.hash)}>
                    <div>
                      <div className={styles.iconWrapper}>
                        {tx.checkpointBloc || isETHTx ? (
                          isRecived ? (
                            <DownArrowIcon />
                          ) : (
                            <UpArrowIcon />
                          )
                        ) : (
                          <Spinner size={16} className={styles.spinner} />
                        )}
                      </div>
                      <span>
                        {isRecived ? 'Received' : 'Sent'}
                        <small>
                          {isRecived
                            ? `From: ${isETHTx ? tx.from[0].from : tx.sender}`
                            : `To: ${isETHTx ? tx.to[0].to : tx.receiver}`}
                        </small>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span>
                          {isETHTx ? tx.balance : tx.amount / 1e8}{' '}
                          <b>{assets[account.activeAssetId].symbol}</b>
                        </span>
                        <small>
                          {isETHTx ? 0 : getFiatAmount(tx.amount / 1e8, 8)}
                        </small>
                      </span>
                      <div className={styles.linkIcon}>
                        <UpArrowIcon />
                      </div>
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <div className={styles.stargazer}>
            <img
              src={StargazerIcon}
              alt="stargazer"
              height="167"
              width="auto"
            />
          </div>
        </>
      ) : (
        <>
          <span className={styles.noTxComment}>
            You have no transaction history, send or receive $DAG to register
            your first transaction.
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
