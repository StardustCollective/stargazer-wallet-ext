///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { formatDistanceDate } from '../../helpers';

///////////////////////
// Components
///////////////////////

import Spinner from '@material-ui/core/CircularProgress';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import LinkIcon from '@material-ui/icons/OpenInNewOutlined';

///////////////////////
// Styles
///////////////////////

import styles from './TxItem.scss'

///////////////////////
// Types
///////////////////////

import { Transaction } from 'state/vault/types';

///////////////////////
// Interfaces
///////////////////////

interface ITxItem {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isETHPending: boolean;
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
  onItemClick?: (hash: string) => void;
}

///////////////////////
// Component
///////////////////////

const TxItem: FC<ITxItem> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isETHPending,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  fiatAmount,
  onItemClick,
}) => {

  const handleOpenExplorer = () => {

    if(onItemClick) {
      onItemClick(isETHPending ? tx.txHash : tx.hash);
    }
  
  }

  const RenderIcon: FC = () => {
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
    <div key={key} className={styles.content}>
      {showGroupBar && (
        <div className={styles.groupBar}>
          <span>{formatDistanceDate(tx.timestamp)}</span>
        </div>
      )}
      <div className={styles.txItem} onClick={handleOpenExplorer}>
        <div className={styles.txIcon}>
          <RenderIcon />
        </div>
        <div className={styles.txInfo}>
          <div>
            <span>
              {isSelf ? 'Self' : (isReceived ? 'Received' : 'Sent')}
            </span>
          </div>
          <div>
            <small>
              {txTypeLabel}
            </small>
          </div>
        </div>
        <div className={styles.txAmount}>
          <span>{amount}<b>{currencySymbol}</b></span>
          <small>{fiatAmount}</small>
        </div>
        <div className={styles.txExplorerIcon}>
          <div className={styles.circle}>
            <LinkIcon />
          </div>
        </div>
      </div>
    </div>
  );

}

export default TxItem;