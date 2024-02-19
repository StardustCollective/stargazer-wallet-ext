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

import CheckCircle from 'assets/images/svg/check-circle.svg';
const imagePlaceholder = require('assets/images/placeholder.png');

///////////////////////
// Types
///////////////////////

import IConfirmationInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////
import {
  YOUR_TOKEN_SWAP_STRING,
  STATUS_OF_YOUR_TRASACTION_STRING,
  VIEW_SWAP_HISTORY_STRING,
  DONE_STRING,
} from './constants';

const ConfirmDetails: FC<IConfirmationInfo> = ({
  onViewSwapHistoryPressed,
  onDonePressed,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.content}>
          <CheckCircle />
          <TextV3.Header
            color={COLORS_ENUMS.PURPLE_DARK}
            extraStyles={styles.tokenSwapText}
          >
            {YOUR_TOKEN_SWAP_STRING}
          </TextV3.Header>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.PURPLE_DARK}
            extraStyles={styles.statusText}
          >
            {STATUS_OF_YOUR_TRASACTION_STRING}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.buttons}>
          <ButtonV3
            title={VIEW_SWAP_HISTORY_STRING}
            size={BUTTON_SIZES_ENUM.FULL_WIDTH}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            onPress={onViewSwapHistoryPressed}
            extraStyles={styles.viewHistoryButton}
          />
          <ButtonV3
            title={DONE_STRING}
            size={BUTTON_SIZES_ENUM.FULL_WIDTH}
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            onPress={onDonePressed}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfirmDetails;
