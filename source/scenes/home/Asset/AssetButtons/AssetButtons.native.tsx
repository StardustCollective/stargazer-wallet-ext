///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
import { iosPlatform } from 'utils/platform';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

const BUTTON_SIZE_WIDTH = 24;
const BUTTON_SIZE_HEIGHT = 24;

const AssetButtons: FC<IAssetButtons> = ({
  assetBuyable,
  onBuyPressed,
  onSendPressed,
  onReceivePressed,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <View style={styles.container}>
      {assetBuyable && !iosPlatform() && (
        <TouchableOpacity onPress={onBuyPressed} style={styles.buttonContainer}>
          <LinearGradient
            useAngle
            angle={0}
            style={styles.icon}
            locations={[0, 1]}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)']}
          >
            <DollarIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
          </LinearGradient>
          <TextV3.CaptionStrong extraStyles={styles.label}>Buy</TextV3.CaptionStrong>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onSendPressed} style={styles.buttonContainer}>
        <LinearGradient
          useAngle
          angle={0}
          style={styles.icon}
          locations={[0, 1]}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)']}
        >
          <ArrowUpIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </LinearGradient>
        <TextV3.CaptionStrong extraStyles={styles.label}>Send</TextV3.CaptionStrong>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReceivePressed} style={styles.buttonContainer}>
        <LinearGradient
          useAngle
          angle={0}
          style={styles.icon}
          locations={[0, 1]}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)']}
        >
          <ArrowDownIcon height={BUTTON_SIZE_HEIGHT} width={BUTTON_SIZE_WIDTH} />
        </LinearGradient>
        <TextV3.CaptionStrong extraStyles={styles.label}>Receive</TextV3.CaptionStrong>
      </TouchableOpacity>
    </View>
  );
};

export default AssetButtons;
