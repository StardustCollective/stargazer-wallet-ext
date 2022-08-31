///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import CurrencyImport from 'components/CurrencyInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////
// Images
///////////////////////

const exolixLogo = require('assets/images/exolixLogo.png');
import SwapArrows from 'assets/images/svg/swapArrows.svg';

///////////////////////
// Types
///////////////////////

import ISwapTokens from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////

import {
  SWAP_FROM_STRING,
  BALANCE_STRING,
  SWAP_TO_STRING,
  RATE_STRING,
  MINIMUM_AMOUNT_STRING,
  NEXT_BUTTON_STRING
} from './constants';


const SwapTokens: FC<ISwapTokens> = ({
  onNextPressed
}) => {

  const [fromInputValue, setFromInputValue] = useState('');

  const fromoOnChangeText = text => {
    console.log(text);
    setFromInputValue(text);
  };

  const onSwapFromPress = () => {
    console.log('On From Press');
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.provider}>
          <View style={styles.thirdPartyTextView}>
            <TextV3.LabelSemiStrong color={COLORS_ENUMS.DARK_GRAY_200}>Third Party Provider</TextV3.LabelSemiStrong>
          </View>
          <View style={styles.exolixTextView}>
            <Image
              style={styles.exolixLogoImage}
              source={exolixLogo}
            />
          </View>
        </View>
        <View>
          <View style={styles.fromInputLabels}>
            <View style={styles.fromInputSwapFromLabel}>
              <TextV3.CaptionStrong
                color={COLORS_ENUMS.DARK_GRAY_200}
              >
                {SWAP_FROM_STRING}
              </TextV3.CaptionStrong>
            </View>
            <View style={styles.fromInputBalanceLabel}>
              <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
                {BALANCE_STRING} 1 ETH
              </TextV3.Caption>
            </View>
          </View>
          <CurrencyImport tickerValue='DAG' onPress={onSwapFromPress} style={styles.fromCurrencyInput} placeholder='1' value={fromInputValue} onChangeText={fromoOnChangeText} />
        </View>
        <View>
          <View style={styles.toInputLabels}>
            <View style={styles.toInputSwapFromLabel}>
              <TextV3.CaptionStrong
                color={COLORS_ENUMS.DARK_GRAY_200}
              >
                {SWAP_TO_STRING}
              </TextV3.CaptionStrong>
            </View>
            <View style={styles.swapIcon}>
              <SwapArrows />
            </View>
            <View style={styles.toBlank} />
          </View>
          <CurrencyImport tickerValue='ETH' style={styles.toCurrencyInput} placeholder='0' />
        </View>
        <View style={styles.rate}>
          <View style={styles.rateLabel}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}>
              {RATE_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.rateValue}>
            <TextV3.Caption
              color={COLORS_ENUMS.DARK_GRAY_200}>
              1 ETH ≈ 3,076.9006 DAG
            </TextV3.Caption>
          </View>
        </View>
        <View style={styles.minimumAmount}>
          <View style={styles.minimumAmountLabel}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}>
              {MINIMUM_AMOUNT_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.minimumAmountValue}>
            <TextV3.Caption
              color={COLORS_ENUMS.DARK_GRAY_200}>
              0.06954103 ETH
            </TextV3.Caption>
          </View>
        </View>
        <View style={styles.nextButton}>
          <ButtonV3
            title={NEXT_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.FULL_WIDTH}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            onPress={onNextPressed}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SwapTokens;
