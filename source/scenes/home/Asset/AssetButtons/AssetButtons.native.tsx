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

///////////////////////////
// Types
///////////////////////////

import { IAssetButtons } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const AssetButtons: FC<IAssetButtons> = ({ onBuyPressed, onSendPressed, onReceivePressed, assetBuyable }) => {
  ///////////////////////////
  // Render
  ///////////////////////////
  
  return (
    <View style={styles.container}>
      {assetBuyable && 
        <TouchableOpacity onPress={onBuyPressed} style={styles.buttonContainer}>
          <View style={styles.icon}>
            <DollarIcon height={24} width={24} />
          </View>
          <TextV3.CaptionStrong extraStyles={styles.label}>Buy</TextV3.CaptionStrong>
        </TouchableOpacity>
      }
      <TouchableOpacity onPress={onSendPressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowUpIcon height={24} width={24} />
        </View>
        <TextV3.CaptionStrong extraStyles={styles.label}>Send</TextV3.CaptionStrong>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReceivePressed} style={styles.buttonContainer}>
        <View style={styles.icon}>
          <ArrowDownIcon height={24} width={24} />
        </View>
        <TextV3.CaptionStrong extraStyles={styles.label}>Receive</TextV3.CaptionStrong>
      </TouchableOpacity>
    </View>
  );
};

export default AssetButtons;
