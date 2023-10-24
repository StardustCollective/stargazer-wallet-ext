import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { NFTSendConfirmProps } from './types';
import styles from './NFTSend.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const NFTSendConfirm: FC<NFTSendConfirmProps> = ({}) => {
  return (
    <div className={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </div>
  );
};

export default NFTSendConfirm;
