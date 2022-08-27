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
import SwapIcon from 'assets/images/svg/swap.svg';

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

import {
  BUY_STRING,
  SWAP_STRING,
  SEND_STRING,
  RECEIVE_STRING
} from './constants';


const AssetButtons: FC<IAssetButtons> = ({ onBuyPressed, onSendPressed, onReceivePressed, onSwapPressed }) => {
  ///////////////////////////
  // Render
  ///////////////////////////
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer} onClick={onBuyPressed}>
        <div className={styles.icon}>
          <img src={`/${DollarIcon}`} alt="dollar-icon" />
        </div>
        <TextV3.Caption>{BUY_STRING}</TextV3.Caption>
      </div>
      <div className={styles.buttonContainer} onClick={onSwapPressed}>
        <div className={styles.icon}>
          <img src={`/${SwapIcon}`} alt="swap-icon" />
        </div>
        <TextV3.Caption>{SWAP_STRING}</TextV3.Caption>
      </div>
      <div className={styles.buttonContainer} onClick={onSendPressed}>
        <div className={styles.icon}>
          <img src={`/${ArrowUpIcon}`} alt="arrow-up-icon" />
        </div>
        <TextV3.Caption>{SEND_STRING}</TextV3.Caption>
      </div>
      <div className={styles.buttonContainer} onClick={onReceivePressed}>
        <div className={styles.icon}>
          <img src={`/${ArrowDownIcon}`} alt="arrow-down-icon" />
        </div>
        <TextV3.Caption>{RECEIVE_STRING}</TextV3.Caption>
      </div>
    </div>
  );
};

export default AssetButtons;
