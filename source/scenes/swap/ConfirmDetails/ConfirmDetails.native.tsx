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
// Types
///////////////////////

import ITransferInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// Helpers
///////////////////////

import { ellipsis } from '../../home/helpers';

///////////////////////
// constants
///////////////////////
import {
  SEND_FROM_STRING,
  SEND_TO_STRING,
  TRANSACTION_FEE_STRING,
  TRANSACTION_ID_STRING,
  MAX_TOTAL_STRING,
  SWAP_BUTTON_STRING,
  CANCEL_BUTTON_STRING,
} from './constants';

const SEND_TO_ADDRESS_NUMBER_OF_LINES = 1;

const ConfirmDetails: FC<ITransferInfo> = ({
  tempTx,
  assetInfo,
  activeWallet,
  feeUnit,
  transactionId,
  isSwapButtonLoading,
  getSendAmount,
  getFeeAmount,
  getTotalAmount,
  onSwapPressed,
  onCancelPressed,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.amount}>
          <TextV3.BodyStrong numberOfLines={1} color={COLORS_ENUMS.BLACK}>
            {tempTx?.amount} {assetInfo.symbol}
            <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
              {' '}
              (≈
              {getSendAmount()})
            </TextV3.Caption>
          </TextV3.BodyStrong>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SEND_FROM_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {activeWallet?.label || ''} ({ellipsis(tempTx?.fromAddress || '')})
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SEND_TO_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
            numberOfLines={SEND_TO_ADDRESS_NUMBER_OF_LINES}
          >
            {tempTx?.toAddress}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {TRANSACTION_FEE_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {`${tempTx?.fee} ${feeUnit} (≈ ${getFeeAmount()})`}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {TRANSACTION_ID_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transactionId}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRowMaxTotal}>
          <View style={styles.detailRowLeft}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY}>
              {MAX_TOTAL_STRING}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.detailRowRight}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
              {tempTx?.amount} {assetInfo.symbol}
            </TextV3.CaptionStrong>
            <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
              ≈ {`$${getTotalAmount()}`}
            </TextV3.Caption>
          </View>
        </View>
        <View style={styles.nextButton}>
          <ButtonV3
            title={CANCEL_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            onPress={onCancelPressed}
          />
          <ButtonV3
            title={SWAP_BUTTON_STRING}
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            loading={isSwapButtonLoading}
            disabled={isSwapButtonLoading}
            onPress={onSwapPressed}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfirmDetails;
