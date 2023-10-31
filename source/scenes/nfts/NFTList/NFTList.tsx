import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { NFTListProps } from './types';
import styles from './NFTList.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const NFTList: FC<NFTListProps> = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default NFTList;
