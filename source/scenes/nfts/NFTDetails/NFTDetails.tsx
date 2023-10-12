import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { NFTDetailsProps } from './types';
import styles from './NFTDetails.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const NFTDetails: FC<NFTDetailsProps> = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default NFTDetails;
