///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import { View, Image, TextInput, TouchableOpacity } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Images/Icons
///////////////////////

const imagePlaceholder = require('assets/images/placeholder.png');
import ChevronRight from 'assets/images/svg/chevron-right.svg';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

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
  style,
  placeholder = '0',
  value,
  onChangeText,
  source,
  onPress,
  tickerValue,
  editable = true,
}) => {
  return (
    <View style={[styles.swapInput, style]}>
      <View style={styles.swapInputLeftBlock}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={TEXT_INPUT_KEYBOARD_TYPE}
          style={styles.swapInputTextInput}
          editable={editable}
        />
      </View>
      <TouchableOpacity onPress={onPress} style={styles.swapInputRightBlock}>
        <Image
          source={source}
          defaultSource={imagePlaceholder}
          style={styles.currencyIcon}
        />
        <TextV3.Body extraStyles={styles.swapInputTickerText} color={COLORS_ENUMS.BLACK}>
          {tickerValue}
        </TextV3.Body>
        <ChevronRight width={CHEVRON_WIDTH} style={styles.swapInputChevron} />
      </TouchableOpacity>
    </View>
  );
};

export default CurrencyInput;
