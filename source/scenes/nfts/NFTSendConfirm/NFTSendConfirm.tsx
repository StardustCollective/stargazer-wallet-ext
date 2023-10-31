import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { NFTSendConfirmProps } from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './NFTSendConfirm.scss';

const NFTSendConfirm: FC<NFTSendConfirmProps> = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default NFTSendConfirm;
