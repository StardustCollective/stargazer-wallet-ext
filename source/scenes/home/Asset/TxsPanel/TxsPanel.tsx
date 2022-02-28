import React, { FC } from 'react';
import { Transaction } from 'state/vault/types';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './Asset.scss';

import ITxPanelSettings from './types';

const TxsPanel: FC<ITxPanelSettings> = ({ transactions, renderTxItem, transactionDescription, getTxLink }) => {
  const handleOpenExplorer = (txHash: string): boolean => {
    if (!txHash) {
      return true;
    }

    const txLink = getTxLink(txHash);
    window.open(txLink, '_blank');

    return true;
  };

  return (
    <div className={styles.activity}>
      {transactions.length ? (
        <div>
          {transactions.map((tx: Transaction, idx: number) => {
            return renderTxItem(tx, idx, handleOpenExplorer);
          })}
        </div>
      ) : (
        <div className={styles.noTx}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>{transactionDescription}</TextV3.Caption>
        </div>
      )}
    </div>
  );
};

export default TxsPanel;
