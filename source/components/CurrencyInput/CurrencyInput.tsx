///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';

///////////////////////
// Images/Icons
///////////////////////

import ImagePlaceholder from 'assets/images/placeholder.png';
import ChevronRight from 'assets/images/svg/chevron-right.svg';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './CurrencyInput.scss';

///////////////////////
// types
///////////////////////

import ICurrencyInput from './types';

///////////////////////
// Constants
///////////////////////

const CHEVRON_WIDTH = 7;

const CurrencyInput: FC<ICurrencyInput> = ({
  containerStyle,
  placeholder = '0',
  value,
  source = ImagePlaceholder,
  onPress,
  tickerValue,
  isError = false,
  onChangeText,
}) => {
  return (
    <div
      className={clsx(styles.swapInput, containerStyle, isError && styles.swapInputError)}
    >
      <div className={styles.swapInputLeftBlock}>
        <TextInput
          type="number"
          value={value}
          placeholder={placeholder}
          classes={{
            root: clsx(styles.swapTextField, isError && styles.swapTextFieldError),
          }}
          onChange={onChangeText}
        />
      </div>
      <div onClick={() => onPress()} className={styles.swapInputRightBlock}>
        <img src={source} className={styles.currencyIcon} />
        <TextV3.Body extraStyles={styles.swapInputTickerText} color={COLORS_ENUMS.BLACK}>
          {tickerValue}
        </TextV3.Body>
        <img
          src={`/${ChevronRight}`}
          className={styles.swapInputChevron}
          alt="chevron_right"
          width={CHEVRON_WIDTH}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
