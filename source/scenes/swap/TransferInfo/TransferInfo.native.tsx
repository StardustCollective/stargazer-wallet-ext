///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

///////////////////////
// Styles
///////////////////////
import { COLORS_ENUMS } from 'assets/styles/colors';

import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import GasSlider from 'components/GasSlider';
///////////////////////
// Components
///////////////////////
import TextV3 from 'components/TextV3';

import { DAG_CODE, DEPOSIT_ADDRESS_STRING, NEXT_BUTTON_STRING, RECOMMENDED_STRING, SWAP_FROM_STRING, SWAP_TO_STRING, TRANSACTION_FEE_DEFAULT_VALUE, TRANSACTION_FEE_STRING } from './constants';
import styles from './styles';
///////////////////////
// Types
///////////////////////
import ITransferInfo from './types';

///////////////////////
// constants
///////////////////////

const DEPOSIT_ADDRESS_NUMBER_OF_LINES = 1;
const TRANSACTION_FEE_KEYBOARD_TYPE = 'numeric';

const SwapTokens: FC<ITransferInfo> = ({ onNextPressed, to, from, depositAddress, gas, onGasPriceChange, onRecommendedPress, onTransactionFeeChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>{DEPOSIT_ADDRESS_STRING}</TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong extraStyles={styles.dataValueText} color={COLORS_ENUMS.DARK_GRAY_200} numberOfLines={DEPOSIT_ADDRESS_NUMBER_OF_LINES}>
              {depositAddress}
            </TextV3.CaptionStrong>
          </View>
        </View>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>{SWAP_FROM_STRING}</TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong extraStyles={styles.dataValueText} color={COLORS_ENUMS.DARK_GRAY_200}>
              {from.amount} {from.code}
            </TextV3.CaptionStrong>
          </View>
        </View>
        <View style={styles.dataRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>{SWAP_TO_STRING}</TextV3.CaptionStrong>
          <View style={styles.dataValue}>
            <TextV3.CaptionStrong extraStyles={styles.dataValueText} color={COLORS_ENUMS.DARK_GRAY_200}>
              {to.amount} {to.code}
            </TextV3.CaptionStrong>
          </View>
        </View>
        {from.code === DAG_CODE ? (
          <View style={styles.dataRow}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>{TRANSACTION_FEE_STRING}</TextV3.CaptionStrong>
            <View style={[styles.dataValue, styles.trasnsactionFee]}>
              <View style={styles.transactionFeeInput}>
                <TextInput onChangeText={onTransactionFeeChange} defaultValue={TRANSACTION_FEE_DEFAULT_VALUE} keyboardType={TRANSACTION_FEE_KEYBOARD_TYPE} style={styles.transactionFeeTextField} />
              </View>
              <View style={styles.transactionFeeRecommend}>
                <TouchableOpacity onPress={onRecommendedPress}>
                  <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>{RECOMMENDED_STRING}</TextV3.Caption>
                </TouchableOpacity>
              </View>
            </View>
            <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
              With current network conditions we recommend a fee of &nbsp;
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>0 DAG</TextV3.Caption>
            </TextV3.Caption>
          </View>
        ) : (
          <>{gas.prices.length > 0 && <GasSlider gas={gas} onGasPriceChange={onGasPriceChange} />}</>
        )}
        <View style={styles.nextButton}>
          <ButtonV3 title={NEXT_BUTTON_STRING} size={BUTTON_SIZES_ENUM.FULL_WIDTH} type={BUTTON_TYPES_ENUM.SECONDARY_SOLID} onPress={onNextPressed} />
        </View>
      </ScrollView>
    </View>
  );
};

export default SwapTokens;
