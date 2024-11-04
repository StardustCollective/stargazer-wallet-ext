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
import { iosPlatform } from 'utils/platform';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { BUY_STRING, SWAP_STRING, SEND_STRING, RECEIVE_STRING } from './constants';

const BUTTON_SIZE_WIDTH = 24;
const BUTTON_SIZE_HEIGHT = 24;

const AssetButtons: FC<IAssetButtons> = ({
  assetBuyable,
  onBuyPressed,
  onSendPressed,
  onReceivePressed,
  onSwapPressed,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <View style={styles.container}>
      {assetBuyable && !iosPlatform() && (
        <TouchableOpacity onPress={onBuyPressed} style={styles.buttonContainer}>
          <View style={styles.icon}>
            <DollarIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
          </View>
          <TextV3.CaptionStrong extraStyles={styles.label}>Buy</TextV3.CaptionStrong>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onSendPressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowUpIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.CaptionStrong extraStyles={styles.label}>Send</TextV3.CaptionStrong>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReceivePressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowDownIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </View>
        <TextV3.CaptionStrong extraStyles={styles.label}>Receive</TextV3.CaptionStrong>
      </TouchableOpacity>
    </View>
  );
};

export default AssetButtons;
