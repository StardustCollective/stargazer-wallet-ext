///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';

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

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import {
  BUY_STRING,
  SWAP_STRING,
  SEND_STRING,
  RECEIVE_STRING
} from './constants';

const BUTTON_SIZE_WIDTH = 24;
const BUTTON_SIZE_HEIGHT = 24;

const AssetButtons: FC<IAssetButtons> = ({ onBuyPressed, onSendPressed, onReceivePressed, onSwapPressed }) => {
  
  ///////////////////////////
  // Render
  ///////////////////////////
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBuyPressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <DollarIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.Caption>{BUY_STRING}</TextV3.Caption>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwapPressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <SwapIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.Caption>{SWAP_STRING}</TextV3.Caption>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSendPressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowUpIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.Caption>{SEND_STRING}</TextV3.Caption>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReceivePressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowDownIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.Caption>{RECEIVE_STRING}</TextV3.Caption>
      </TouchableOpacity>
    </View>
  );
};

export default AssetButtons;
