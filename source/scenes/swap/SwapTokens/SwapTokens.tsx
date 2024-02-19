///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import CurrencyImport from 'components/CurrencyInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';

///////////////////////
// Images
///////////////////////

import ExolixLogo from 'assets/images/exolixLogo.png';
import SwapArrows from 'assets/images/svg/swapArrows.svg';

///////////////////////
// Types
///////////////////////

import ISwapTokens from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './SwapTokens.scss';

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
  CURRENCY_INPUT_ZERO_PLACEHOLDER,
  TO_CURRENCY_INPUT_EDITABLE,
} from './constants';

const CIRCULAR_PROGRESS_SIZE = 20;
const EXOLIX_LOGO_WIDTH = 80;
const EXOLIX_LOGO_HEIGHT = 32;

const SwapTokens: FC<ISwapTokens> = ({
  onNextPressed,
  selectedCurrencySwapFrom,
  selectedCurrencySwapTo,
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

  const fromOnChangeText = (e: any) => {
    const text = e.target.value;
    setFromInputValue(text);
    if (onFromChangeText) {
      onFromChangeText(text);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.provider}>
        <div className={styles.thirdPartyTextView}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            Third Party Provider
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.exolixTextView}>
          <img
            src={`/${ExolixLogo}`}
            alt="exolix"
            width={EXOLIX_LOGO_WIDTH}
            height={EXOLIX_LOGO_HEIGHT}
          />
        </div>
      </div>
      <div className={styles.fromInputLabels}>
        <div className={styles.fromInputSwapFromLabel}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            {SWAP_FROM_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.fromInputBalanceLabel}>
          <TextV3.Caption
            color={isBalanceError ? COLORS_ENUMS.RED : COLORS_ENUMS.DARK_GRAY_200}
          >
            {BALANCE_STRING}{' '}
            {`${formatStringDecimal(formatNumber(Number(fromBalance), 16, 20), 4)}`}{' '}
            {selectedCurrencySwapFrom.code}
          </TextV3.Caption>
        </div>
      </div>
      <CurrencyImport
        source={selectedCurrencySwapFrom.icon}
        tickerValue={selectedCurrencySwapFrom.code}
        onPress={onSwapFromTokenListPressed}
        onChangeText={fromOnChangeText}
        containerStyle={styles.fromCurrencyInputContainer}
        placeholder={CURRENCY_INPUT_ZERO_PLACEHOLDER}
        value={fromInputValue}
        isError={isBalanceError || isRateError}
      />
      <div className={styles.toInputLabels}>
        <div className={styles.toInputSwapLabel}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            {SWAP_TO_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.swapIcon}>
          <img src={`/${SwapArrows}`} />
        </div>
        <div className={styles.toBlank} />
      </div>
      <CurrencyImport
        editable={TO_CURRENCY_INPUT_EDITABLE}
        source={selectedCurrencySwapTo.icon}
        tickerValue={selectedCurrencySwapTo.code}
        onPress={onSwapToTokenListPressed}
        containerStyle={styles.toCurrencyInputContainer}
        placeholder={CURRENCY_INPUT_ZERO_PLACEHOLDER}
        value={toAmount?.toString()}
        onChangeText={() => {}}
      />
      <div className={styles.rate}>
        <div className={styles.rateLabel}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            {RATE_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.rateValue}>
          {isCurrencyRateLoading ? (
            <>
              <CircularProgress size={CIRCULAR_PROGRESS_SIZE} />
            </>
          ) : !isRateError && currencyRate?.rate !== undefined ? (
            <>
              <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
                {EXCHANGE_RATE_ONE} {selectedCurrencySwapFrom?.code} ≈{' '}
                {currencyRate?.rate} {selectedCurrencySwapTo?.code}
              </TextV3.Caption>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={styles.minimumAmount}>
        <div className={styles.minimumAmountLabel}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            {MINIMUM_AMOUNT_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.minimumAmountValue}>
          {isCurrencyRateLoading ? (
            <>
              <CircularProgress size={CIRCULAR_PROGRESS_SIZE} />
            </>
          ) : currencyRate?.minAmount !== undefined ? (
            <TextV3.Caption
              color={isRateError ? COLORS_ENUMS.RED : COLORS_ENUMS.DARK_GRAY_200}
            >
              {currencyRate?.minAmount?.toString()} {selectedCurrencySwapFrom?.code}
            </TextV3.Caption>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={styles.nextButton}>
        <ButtonV3
          label={NEXT_BUTTON_STRING}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onNextPressed}
          disabled={isNextButtonDisabled}
          loading={isNextButtonLoading}
          extraStyle={styles.buttonNormal}
        />
      </div>
    </div>
  );
};

export default SwapTokens;
