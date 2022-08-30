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
import MUITextField from '@material-ui/core/TextField';

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
const TEXT_INPUT_KEYBOARD_TYPE = 'numeric';

const CurrencyInput: FC<ICurrencyInput> = ({
  containerStyle,
  inputStyle,
  placeholder = '0',
  value,
  source,
  onPress,
  tickerValue,
  onChangeText,
  ...otherProps
}) => {

  if (!source) {
    source = ImagePlaceholder
  }

  return (
    <div className={clsx(styles.swapInput, containerStyle)}>
      <div className={styles.swapInputLeftBlock}>
        <MUITextField
          id="curreny-input"
          name="currency-input"
          value={value}
          placeholder={placeholder}
          fullWidth
          onChange={onChangeText}
          InputProps={{ 
            disableUnderline: true,
            classes: {
              input: styles.swapInputTextInput,
            }
          }}
          {...otherProps}
        />
      </div>
      <div onClick={onPress} className={styles.swapInputRightBlock}>
        <img src={`/${source}`} className={styles.currencyIcon}/>
        <TextV3.Body extraStyles={styles.swapInputTickerText} color={COLORS_ENUMS.BLACK}>{tickerValue}</TextV3.Body>
        <img src={`/${ChevronRight}`} className={styles.swapInputChevron} alt="chevron_right" width={CHEVRON_WIDTH} />
      </div>
    </div>
  );
};

export default CurrencyInput;
