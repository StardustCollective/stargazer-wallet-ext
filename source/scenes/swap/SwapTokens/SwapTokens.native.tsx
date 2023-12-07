///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { DotIndicator } from 'react-native-indicators';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';

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
  NEXT_BUTTON_STRING,
  EXCHANGE_RATE_ONE,
  DOT_INDICATOR_SIZE,
  DOT_INDICATOR_COUNT,
  DOT_INDICATOR_COLOR,
  CURRENCY_INPUT_ZERO_PLACEHOLDER,
  TO_CURRENCY_INPUT_EDITABLE,
} from './constants';

///////////////////////
// Scene
///////////////////////

const SwapTokens: FC<ISwapTokens> = ({
  selectedCurrencySwapFrom,
  selectedCurrencySwapTo,
  onNextPressed,
  onSwapFromTokenListPressed,
  onSwapToTokenListPressed,
  fromBalance,
  onFromChangeText,
  isBalanceError,
  isNextButtonDisabled,
  isRateError,
  isCurrencyRateLoading,
  currencyRate,
  toAmount,
  isNextButtonLoading,
}) => {
  const [fromInputValue, setFromInputValue] = useState('');

  const fromoOnChangeText = (text) => {
    setFromInputValue(text);
    if (onFromChangeText) {
      onFromChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.provider}>
          <View style={styles.thirdPartyTextView}>
            <TextV3.LabelSemiStrong color={COLORS_ENUMS.DARK_GRAY_200}>
              Third Party Provider
            </TextV3.LabelSemiStrong>
          </View>
          <View style={styles.exolixTextView}>
            <Image style={styles.exolixLogoImage} source={exolixLogo} />
          </View>
        </View>
        <View>
          <View style={styles.fromInputLabels}>
            <View style={styles.fromInputSwapFromLabel}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
                {SWAP_FROM_STRING}
              </TextV3.CaptionStrong>
            </View>
            <View style={styles.fromInputBalanceLabel}>
              <TextV3.Caption
                color={isBalanceError ? COLORS_ENUMS.RED : COLORS_ENUMS.DARK_GRAY_200}
              >
                {BALANCE_STRING}{' '}
                {`${formatStringDecimal(formatNumber(Number(fromBalance), 16, 20), 4)}`}{' '}
                {selectedCurrencySwapFrom.code}
              </TextV3.Caption>
            </View>
          </View>
          <CurrencyImport
            source={{ uri: selectedCurrencySwapFrom.icon }}
            tickerValue={selectedCurrencySwapFrom.code}
            onPress={onSwapFromTokenListPressed}
            onChangeText={fromoOnChangeText}
            style={
              isBalanceError || isRateError
                ? styles.fromCurrencyInputError
                : styles.fromCurrencyInput
            }
            placeholder={CURRENCY_INPUT_ZERO_PLACEHOLDER}
            value={fromInputValue}
          />
        </View>
        <View>
          <View style={styles.toInputLabels}>
            <View style={styles.toInputSwapFromLabel}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
                {SWAP_TO_STRING}
              </TextV3.CaptionStrong>
            </View>
            <View style={styles.swapIcon}>
              <SwapArrows />
            </View>
            <View style={styles.toBlank} />
          </View>
          <CurrencyImport
            source={{ uri: selectedCurrencySwapTo.icon }}
            tickerValue={selectedCurrencySwapTo.code}
            onPress={onSwapToTokenListPressed}
            style={styles.toCurrencyInput}
            placeholder={CURRENCY_INPUT_ZERO_PLACEHOLDER}
            editable={TO_CURRENCY_INPUT_EDITABLE}
            value={toAmount.toString()}
            onChangeText={onFromChangeText}
          />
        </View>
        <View style={styles.rate}>
          <View style={styles.rateLabel}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
              {RATE_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.rateValue}>
            {isCurrencyRateLoading ? (
              <>
                <DotIndicator
                  size={DOT_INDICATOR_SIZE}
                  count={DOT_INDICATOR_COUNT}
                  color={DOT_INDICATOR_COLOR}
                />
              </>
            ) : !isRateError && currencyRate?.rate !== undefined ? (
              <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
                {EXCHANGE_RATE_ONE} {selectedCurrencySwapFrom?.code} ≈{' '}
                {currencyRate?.rate} {selectedCurrencySwapTo?.code}
              </TextV3.Caption>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.minimumAmount}>
          <View style={styles.minimumAmountLabel}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
              {MINIMUM_AMOUNT_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.minimumAmountValue}>
            {isCurrencyRateLoading ? (
              <>
                <DotIndicator
                  size={DOT_INDICATOR_SIZE}
                  count={DOT_INDICATOR_COUNT}
                  color={DOT_INDICATOR_COLOR}
                />
              </>
            ) : currencyRate?.minAmount !== undefined ? (
              <TextV3.Caption
                color={isRateError ? COLORS_ENUMS.RED : COLORS_ENUMS.DARK_GRAY_200}
              >
                {currencyRate?.minAmount} {selectedCurrencySwapFrom?.code}
              </TextV3.Caption>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.nextButton}>
          <ButtonV3
            title={NEXT_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.FULL_WIDTH}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            disabled={isNextButtonDisabled}
            loading={isNextButtonLoading}
            onPress={onNextPressed}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SwapTokens;
