///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import { View, ScrollView, Image } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////
// Images
///////////////////////

const imagePlaceholder = require('assets/images/placeholder.png');

///////////////////////
// Types
///////////////////////

import ITransferInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////
import {
  SEND_FROM_STRING,
  SEND_TO_STRING,
  TRANSACTION_FEE_STRING,
  TRANSACTION_ID_STRING,
  MAX_TOTAL_STRING,
  SWAP_BUTTON_STRING,
  CANCEL_BUTTON_STRING
} from './constants';


const ConfirmDetails: FC<ITransferInfo> = ({
  onNextPressed,
  source = imagePlaceholder
}) => {

  const [fromInputValue, setFromInputValue] = useState('');

  const fromoOnChangeText = text => {
    console.log(text);
    setFromInputValue(text);
  };

  const onSwapFromPress = () => {
    console.log('On From Press');
  }

  const onRecommendedPress = () => {
    console.log('On Recommended PRessed');
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.amount}>
          <Image source={source} style={styles.currencyIcon} />
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
            1,000.9089 DAG
          </TextV3.BodyStrong>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SEND_FROM_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            Main Wallet (0x4ef...sVy5T)
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SEND_TO_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            0x997b0F25155C8225d51A46e28d77aacD7737cb2d
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {TRANSACTION_FEE_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            0.000315 ETH (≈ $0.49877773000000003)
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {TRANSACTION_ID_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            174dj334jjfdjfkds3ww
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRowMaxTotal}>
          <View style={styles.detailRowLeft}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY}
            >
              {MAX_TOTAL_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.detailRowRight}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              3,076.9006 DAG
            </TextV3.CaptionStrong>
            <TextV3.Caption
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              ≈ $189.725531
            </TextV3.Caption>
          </View>
        </View>
        <View style={styles.nextButton}>
          <ButtonV3
            title={CANCEL_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            onPress={onNextPressed}
          />
          <ButtonV3
            title={SWAP_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            onPress={onNextPressed}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfirmDetails;
