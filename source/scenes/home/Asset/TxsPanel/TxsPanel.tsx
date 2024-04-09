import React, { FC } from 'react';
import { Transaction } from 'state/vault/types';
import TextV3 from 'components/TextV3';
import LoadingTxItem from '../LoadingTxItem';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import styles from './TxsPanel.scss';
import ITxPanelSettings from './types';

const TxsPanel: FC<ITxPanelSettings> = ({
  transactions,
  renderTxItem,
  transactionDescription,
  loading,
}) => {
  const showLoadingList = loading;
  const showTransactions = !showLoadingList && !!transactions?.length;
  const showEmptyList = !showLoadingList && !transactions?.length;

  return (
    <div className={styles.activity}>
      {showTransactions && (
        <div>
          {transactions.map((tx: Transaction, idx: number) => {
            return renderTxItem(tx, idx);
          })}
        </div>
      )}
      {showEmptyList && (
        <div className={styles.noDataContainer}>
          <img src={`/${StargazerCard}`} height={64} alt="Stargazer card" />
          <TextV3.BodyStrong extraStyles={styles.noFoundText}>
            {transactionDescription}
          </TextV3.BodyStrong>
        </div>
      )}
      {showLoadingList && (
        <div>
          <LoadingTxItem />
          <LoadingTxItem />
          <LoadingTxItem />
        </div>
      )}
    </div>
  );
};

export default TxsPanel;
