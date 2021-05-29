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
import IVaultState, { AssetType, Transaction } from 'state/vault/types';
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
  const { activeNetwork, activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  // const account = accounts[activeAccountId];
  const [scrollArea, setScrollArea] = useState<HTMLElement>();

  const isShowedGroupBar = useCallback(
    (tx: Transaction, idx: number) => {
      return (
        idx === 0 ||
        new Date(
          !isETHTx || (isETHTx && tx.assetId === activeAsset.id)
            ? tx.timestamp
            : tx.date
        ).toDateString() !==
          new Date(
            !isETHTx ||
            (isETHTx && transactions[idx - 1].assetId === activeAsset.id)
              ? transactions[idx - 1].timestamp
              : transactions[idx - 1].date
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
    const ethUrl = ETH_NETWORK[activeNetwork[AssetType.Ethereum]].etherscan;
    window.open(
      isETHTx ? `${ethUrl}tx/${tx}` : `${DAG_EXPLORER_SEARCH}${tx}`,
      '_blank'
    );
  };

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
  };

  const renderIcon = (isETHTx: boolean, isRecived: boolean, tx: any) => {
    if (!isETHTx) {
      return (
        <>
          {tx.checkpointBlock ? (
            isRecived ? (
              <DownArrowIcon />
            ) : (
              <UpArrowIcon />
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
          isRecived ? (
            <DownArrowIcon />
          ) : (
            <UpArrowIcon />
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
              const isETHPending =
                isETHTx && tx.assetId === activeAsset.id;
              const isRecived =
                (!isETHTx && tx.receiver === address) ||
                (isETHTx && !tx.assetId && tx.to && tx.to[0].to === address) ||
                (isETHPending && tx.toAddress === address);

              return (
                <Fragment key={uuid()}>
                  {isShowedGroupBar(tx, idx) && (
                    <li className={styles.groupbar}>
                      {formatDistanceDate(
                        !isETHTx || isETHPending ? tx.timestamp : tx.date
                      )}
                    </li>
                  )}
                  <li
                    onClick={() =>
                      handleOpenExplorer(isETHPending ? tx.txHash : tx.hash)
                    }
                  >
                    <div>
                      <div className={styles.iconWrapper}>
                        {renderIcon(isETHTx, isRecived, tx)}
                      </div>
                      <span>
                        {isRecived ? 'Received' : 'Sent'}
                        <small>
                          {isRecived
                            ? `From: ${
                                isETHPending
                                  ? tx.fromAddress
                                  : isETHTx
                                  ? tx.from && tx.from[0].from
                                  : tx.sender
                              }`
                            : `To: ${
                                isETHPending
                                  ? tx.toAddress
                                  : isETHTx
                                  ? tx.to && tx.to[0].to
                                  : tx.receiver
                              }`}
                        </small>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span>
                          {isETHTx
                            ? Number(
                                isETHPending ? tx.amount : tx.balance
                              ).toFixed(4)
                            : tx.amount / 1e8}{' '}
                          <b>{assets[activeAsset.id].symbol}</b>
                        </span>
                        <small>
                          {isETHTx
                            ? getFiatAmount(
                                Number(isETHPending ? tx.amount : tx.balance),
                                2
                              )
                            : getFiatAmount(tx.amount / 1e8, 8)}
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
