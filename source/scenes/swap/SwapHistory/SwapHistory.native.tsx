///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import dayjs from 'dayjs';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import ChevronRight from 'assets/images/svg/chevron-right.svg';
import TxIcon from 'assets/images/svg/txIcon.svg';

///////////////////////
// Types
///////////////////////

import ISwapHistory from './types';
import { IExolixTransaction, ExolixTransactionStatuses } from 'state/swap/types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////

const CHEVRON_WIDTH = 7;
const MATERIAL_ACTIVITY_INDICATOR_SIZE = 17;
const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = 'rgb(255, 255, 255)';

import {
  PROCESSING_STRING,
  SWAP_STRING,
  TO_STRING,
  DATE_FORMAT,
  NO_TRANSACTIONS,
} from './constants';

const ConfirmDetails: FC<ISwapHistory> = ({
  transactionHistoryData,
  onTransactionCellPressed,
  isLoading,
}) => {
  const RenderHistoryCell = ({
    swapFromTicker,
    swapToTicker,
    amount,
    date,
    isProcessing = false,
    onPress,
  }: {
    swapFromTicker: string;
    swapToTicker: string;
    amount: string;
    date?: string;
    isProcessing?: boolean;
    onPress: () => void;
  }) => {
    const cellStateStyle = isProcessing
      ? styles.historyCellProcessing
      : styles.historyCellSettled;

    return (
      <TouchableOpacity onPress={onPress} style={[styles.historyCell, cellStateStyle]}>
        <View style={styles.historyCellLeft}>
          {isProcessing && (
            <>
              <View style={styles.activityIndicator}>
                <MaterialIndicator
                  size={MATERIAL_ACTIVITY_INDICATOR_SIZE}
                  color={ACTIVITY_INDICATOR_COLOR}
                />
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
                  {dayjs(date).format(DATE_FORMAT)}
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
            {amount} {swapFromTicker}
          </TextV3.CaptionRegular>
          <ChevronRight width={CHEVRON_WIDTH} />
        </View>
      </TouchableOpacity>
    );
  };

  const RenderTransaction = ({ item }: { item: IExolixTransaction }) => {
    return (
      <>
        <RenderHistoryCell
          swapFromTicker={item?.coinFrom.coinCode}
          swapToTicker={item?.coinTo.coinCode}
          amount={item?.amount}
          date={item?.createdAt}
          isProcessing={item?.status !== ExolixTransactionStatuses.SUCCESS}
          onPress={() => onTransactionCellPressed(item)}
        />
      </>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.listEmptyContainer}>
        {isLoading ? (
          <>
            <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} />
          </>
        ) : (
          <>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_TRANSACTIONS}</TextV3.Body>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={ListEmptyComponent}
        data={transactionHistoryData}
        renderItem={RenderTransaction}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      />
    </View>
  );
};

export default ConfirmDetails;
