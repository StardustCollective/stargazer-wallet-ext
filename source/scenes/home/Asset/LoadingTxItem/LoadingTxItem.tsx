import React, { FC } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import styles from './LoadingTxItem.scss';

const renderItem = () => {
  return (
    <div className={styles.content}>
      <div className={styles.txIcon}>
        <Skeleton
          variant="circle"
          animation="wave"
          height={32}
          width={32}
          style={{ marginRight: 18 }}
        />
      </div>
      <div className={styles.txInfo}>
        <Skeleton
          variant="rect"
          animation="wave"
          height={18}
          width={100}
          style={{ marginBottom: 4, borderRadius: 2 }}
        />
        <Skeleton
          variant="rect"
          animation="wave"
          height={14}
          width={60}
          style={{ borderRadius: 2 }}
        />
      </div>
      <div className={styles.txAmount}>
        <Skeleton
          variant="rect"
          animation="wave"
          height={18}
          width={100}
          style={{ marginBottom: 4, borderRadius: 2 }}
        />
        <Skeleton
          variant="rect"
          animation="wave"
          height={14}
          width={60}
          style={{ borderRadius: 2 }}
        />
      </div>
    </div>
  );
};

const LoadingTxItem: FC = () => {
  return (
    <div className={styles.txItem}>
      <div className={styles.groupBar}>
        <Skeleton
          variant="rect"
          animation="wave"
          height={18}
          width={100}
          style={{ marginLeft: 16, borderRadius: 2 }}
        />
      </div>
      {renderItem()}
      {renderItem()}
      {renderItem()}
    </div>
  );
};

export default LoadingTxItem;
