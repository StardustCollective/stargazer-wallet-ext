import React from 'react';
import styles from './LoadingList.scss';
import LoadingCardNFT from 'components/LoadingCardNFT';

const DATA = [1, 2, 3, 4, 5, 6, 7, 8];

const LoadingList = () => {
  const renderLoadingItem = (item: number) => {
    return <LoadingCardNFT key={item} />;
  };

  return (
    <div className={styles.container}>{DATA.map((item) => renderLoadingItem(item))}</div>
  );
};

export default LoadingList;
