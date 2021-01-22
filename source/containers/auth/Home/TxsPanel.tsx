import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useFiat } from 'hooks/usePrice';
import { Transaction } from '@stardust-collective/dag4-network';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import DownArrowIcon from '@material-ui/icons/ArrowDownward';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '@material-ui/core/CircularProgress';

import { formatDistanceDate } from '../helpers';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { DAG_EXPLORER_SEARCH } from 'constants/index';

import styles from './Home.scss';

interface ITxsPanel {
  address: string;
  transactions: Transaction[];
}

const TxsPanel: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();
  const [isShowed, setShowed] = useState<boolean>(false);
  const [scrollArea, setScrollArea] = useState<HTMLElement>();

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

  const handleScroll = useCallback((ev) => {
    ev.persist();
    setShowed(ev.target.scrollTop);
    setScrollArea(ev.target);
  }, []);

  const handleOpenExplorer = (tx: string) => {
    window.open(`${DAG_EXPLORER_SEARCH}${tx}`, '_blank');
  };

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
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
        <ul>
          {transactions.map((tx: Transaction, idx: number) => {
            const isRecived = tx.receiver === address;

            return (
              <>
                {isShowedGroupBar(tx, idx) && (
                  <li className={styles.groupbar} key={tx.hash + tx.timestamp}>
                    {formatDistanceDate(tx.timestamp)}
                  </li>
                )}
                <li
                  key={tx.timestamp}
                  onClick={() => handleOpenExplorer(tx.hash)}
                >
                  <div>
                    <div className={styles.iconWrapper}>
                      {tx.checkpointBlock ? (
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
                          ? `From: ${tx.sender}`
                          : `To: ${tx.receiver}`}
                      </small>
                    </span>
                  </div>
                  <div>
                    <span>
                      <span>
                        {tx.amount / 1e8} <b>DAG</b>
                      </span>
                      <small>{getFiatAmount(tx.amount / 1e8, 8)}</small>
                    </span>
                    <div
                      className={clsx(styles.linkIcon, {
                        [styles.received]: isRecived,
                      })}
                    >
                      <UpArrowIcon />
                    </div>
                  </div>
                </li>
              </>
            );
          })}
          <div className={styles.stargazer}>
            <img src={StargazerIcon} alt="stargazer" />
          </div>
        </ul>
      ) : (
        <>
          <span className={styles.noTxComment}>
            You have no transaction history, send or receive $DAG to register
            your first transaction.
          </span>
          <img src={StargazerIcon} className={styles.stargazer} />
        </>
      )}
    </section>
  );
};

export default TxsPanel;
