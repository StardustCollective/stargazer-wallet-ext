import React from 'react';
import TextV3 from 'components/TextV3';
import styles from './LoadingList.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const LoadingList = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default LoadingList;
