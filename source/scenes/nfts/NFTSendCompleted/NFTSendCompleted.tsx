import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { NFTSendCompletedProps } from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './NFTSendCompleted.scss';

const NFTSendCompleted: FC<NFTSendCompletedProps> = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default NFTSendCompleted;
