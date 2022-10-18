///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { DotIndicator } from 'react-native-indicators';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import PurpleSlider from 'components/PurpleSlider';
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

const DEPOSIT_ADDRESS_NUMBER_OF_LINES = 1;
const TRANSACTION_FEE_KEYBOARD_TYPE = 'numeric';

import {
  DEPOSIT_ADDRESS_STRING,
  SWAP_FROM_STRING,
  SWAP_TO_STRING,
  TRANSACTION_FEE_STRING,
  RECOMMENDED_STRING,
  NEXT_BUTTON_STRING,
  GAS_PRICE_IN_GWEI_STRING,
  GAS_SLIDER_STEP,
  DAG_CODE,
  TRANSACTION_FEE_DEFAULT_VALUE,
} from './constants';

const SwapTokens: FC<ITransferInfo> = ({
  onNextPressed,
  to,
  from,
  depositAddress,
  gas,
  onGasPriceChange,
  getFiatAmount,
  onRecommendedPress,
  onTransactionFeeChange
}) => {

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
              numberOfLines={DEPOSIT_ADDRESS_NUMBER_OF_LINES}
            >
              {depositAddress}
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
              {from.amount} {from.code}
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
              {to.amount} {to.code}
            </TextV3.CaptionStrong>
          </View>
        </View>
        {from.code === DAG_CODE ? (
          <View style={styles.dataRow}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}
            >
              {TRANSACTION_FEE_STRING}
            </TextV3.CaptionStrong>
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
              With current network conditions we recommened a fee of &nbsp;
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                0 DAG
              </TextV3.Caption>
            </TextV3.Caption>
          </View>
        ) : (
          <>
            {gas.prices.length > 0 && (
              <>
                <View style={styles.gasPriceContainer}>
                  <View style={styles.gasPriceHeader}>
                    <View style={styles.gasPriceHeaderLeft}>
                      <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK}>{GAS_PRICE_IN_GWEI_STRING}</TextV3.LabelSemiStrong>
                    </View>
                    <View style={styles.gasPriceHeaderRight}>
                      <View style={styles.gasSpeedBox}>
                        <View style={styles.gasSpeedBoxLeft}>
                          <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>{gas.price.toString()}</TextV3.CaptionRegular>
                        </View>
                        <View style={styles.gasSpeedBoxRight}>
                          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{gas.speedLabel}</TextV3.CaptionStrong>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.gasPriceFooter}>
                    <View style={styles.sliderContainer}>
                      <PurpleSlider
                        onChange={onGasPriceChange}
                        min={gas.prices[0]}
                        max={gas.prices[2]}
                        value={gas.price}
                        step={GAS_SLIDER_STEP}
                      />
                    </View>
                  </View>

                </View>
                <TextV3.CaptionRegular extraStyles={styles.gasEstimateLabel} color={COLORS_ENUMS.DARK_GRAY_200}>
                  {`${gas.price} GWEI, ${gas.fee} ${from.code} (≈ ${getFiatAmount(gas.fee, 2, gas.basePriceId)})`}
                </TextV3.CaptionRegular>
              </>
            )}
          </>
        )}
        <View style={styles.nextButton}>
          <ButtonV3
            title={NEXT_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.FULL_WIDTH}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            onPress={onNextPressed}
          />
        </View>
      </ScrollView>
    </View >
  );
};

export default SwapTokens;
