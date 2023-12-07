///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import DollarIcon from 'assets/images/svg/dollar.svg';
import ArrowUpIcon from 'assets/images/svg/arrow-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-down.svg';

///////////////////////////
// Types
///////////////////////////

import { IAssetButtons } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './AssetButtons.scss';

///////////////////////////
// Constants
///////////////////////////

const AssetButtons: FC<IAssetButtons> = ({
  onBuyPressed,
  onSendPressed,
  onReceivePressed,
  assetBuyable,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////
  return (
    <div className={styles.container}>
      {assetBuyable && (
        <div className={styles.buttonContainer} onClick={onBuyPressed}>
          <div className={styles.icon}>
            <img src={`/${DollarIcon}`} alt="dollar-icon" />
          </div>
          <TextV3.CaptionStrong extraStyles={styles.label}>Buy</TextV3.CaptionStrong>
        </div>
      )}
      <div className={styles.buttonContainer} onClick={onSendPressed}>
        <div className={styles.icon}>
          <img src={`/${ArrowUpIcon}`} alt="arrow-up-icon" />
        </div>
        <TextV3.CaptionStrong extraStyles={styles.label}>Send</TextV3.CaptionStrong>
      </div>
      <div className={styles.buttonContainer} onClick={onReceivePressed}>
        <div className={styles.icon}>
          <img src={`/${ArrowDownIcon}`} alt="arrow-down-icon" />
        </div>
        <TextV3.CaptionStrong extraStyles={styles.label}>Receive</TextV3.CaptionStrong>
      </div>
    </div>
  );
};

export default AssetButtons;
