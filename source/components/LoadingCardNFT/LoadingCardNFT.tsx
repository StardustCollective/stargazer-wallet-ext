import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import styles from './LoadingCardNFT.scss';

const LoadingCardNFT = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <Skeleton
        variant="rect"
        animation="wave"
        height={148}
        width={'100%'}
        style={{ borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
      />
      <div className={styles.textContainer}>
        <Skeleton variant="rect" animation="wave" height={20} width={'100%'} />
        <Skeleton
          variant="rect"
          animation="wave"
          height={20}
          width={50}
          style={{ marginTop: 4 }}
        />
      </div>
    </div>
  );
};

export default LoadingCardNFT;
