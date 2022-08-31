///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

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
  DEPOSIT_ADDRESS_STRING,
  SWAP_FROM_STRING,
  SWAP_TO_STRING,
  TRANSACTION_FEE_STRING,
  RECOMMENDED_STRING,
  NEXT_BUTTON_STRING
} from './constants';


const SwapTokens: FC<ITransferInfo> = ({
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

  const onRecommendedPress = () => {
    console.log('On Recommended PRessed');
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {DEPOSIT_ADDRESS_STRING}
          </TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong
              extraStyles={styles.dataValueText}
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              DAG6qDhaQwhjSRpmWTFe6GTvLN9XwgiDBXkLMosK
            </TextV3.CaptionStrong>
          </View>
        </View>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {SWAP_FROM_STRING}
          </TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong
              extraStyles={styles.dataValueText}
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              1,500 DAG
            </TextV3.CaptionStrong>
          </View>
        </View>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {SWAP_TO_STRING}
          </TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong
              extraStyles={styles.dataValueText}
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              241.7186 LTX
            </TextV3.CaptionStrong>
          </View>
        </View>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {TRANSACTION_FEE_STRING}
          </TextV3.CaptionStrong>
          <View style={[styles.dataValue, styles.trasnsactionFee]}>
            <View style={styles.transactionFeeInput}>
              <TextInput defaultValue='0' keyboardType='numeric' style={styles.transactionFeeTextField} />
            </View>
            <View style={styles.transactionFeeRecommend}>
              <TouchableOpacity onPress={onRecommendedPress}>
                <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>{RECOMMENDED_STRING}</TextV3.Caption>
              </TouchableOpacity>
            </View>
          </View>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            With current network conditions we recommened a fee of &nbsp;
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              0 DAG
            </TextV3.Caption>
          </TextV3.Caption>
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
