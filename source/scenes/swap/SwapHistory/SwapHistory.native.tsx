///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////
// Images
///////////////////////

import ChevronRight from 'assets/images/svg/chevron-right.svg';
import TxIcon from 'assets/images/svg/txIcon.svg';
const imagePlaceholder = require('assets/images/placeholder.png');

///////////////////////
// Types
///////////////////////

import ISwapHistory from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////

const CHEVRON_WIDTH = 7;
const ACTIVITY_INDICATOR_SIZE = 17;
const ACTIVITY_INDICATOR_COLOR = "rgb(255, 255, 255)";

import {

  TODAY_STRING,
  YESTERDAY_STRING,
  PROCESSING_STRING,
  SWAP_STRING,
  TO_STRING,
} from './constants';


const ConfirmDetails: FC<ISwapHistory> = ({

}) => {


  // const RenderDateCell = () => {
  //   return (

  //   )
  // }

  const RenderHistoryCell = ({ swapFromTicker, swapToTicker, amount, date, isProcessing = false, onPress }: { swapFromTicker: string, swapToTicker: string, amount: string, date?: string, isProcessing?: boolean, onPress: () => void }) => {

    const cellStateStyle = isProcessing ? styles.historyCellProcessing : styles.historyCellSettled;

    return (
      <TouchableOpacity style={[styles.historyCell, cellStateStyle]}>
        <View style={styles.historyCellLeft}>
          {isProcessing && (
            <>
              <View style={styles.activityIndicator}>
                <MaterialIndicator size={ACTIVITY_INDICATOR_SIZE} color={ACTIVITY_INDICATOR_COLOR} />
              </View>
              <TextV3.CaptionStrong
                color={COLORS_ENUMS.BLACK}
                extraStyles={styles.processingText}
              >
                {PROCESSING_STRING}
              </TextV3.CaptionStrong>
            </>
          )}
          {!isProcessing && (
            <>
              <TxIcon />
              <View style={styles.swapInfo}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {SWAP_STRING} {swapFromTicker} {TO_STRING} {swapToTicker}
                </TextV3.CaptionStrong>
                <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                  {date}
                </TextV3.Caption>
              </View>
            </>
          )}
        </View>
        <View style={styles.historyCellRight}>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.amountText}
          >
            {amount} {swapToTicker}
          </TextV3.CaptionRegular>
          <ChevronRight width={CHEVRON_WIDTH} />
        </View>
      </TouchableOpacity>
    );
  }

  const RenderDateSection = ({ date }: { date: string }) => {
    return (
      <View>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        <RenderHistoryCell 
          swapFromTicker={'ETH'} 
          swapToTicker={'DAG'} 
          amount={'1111.00232'} 
          date={'16 Jul 2022 10:03:06'} 
          isProcessing={false} 
          onPress={() => console.log('Clicked History Cell')}
        />
      </ScrollView>
    </View>
  );
};

export default ConfirmDetails;
