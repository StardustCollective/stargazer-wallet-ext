///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

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
import {
  DATE_FORMAT,
  STATUS_STRING,
  SENT_TIME,
  SWAP_FROM,
  SWAP_FROM_AMOUNT,
  SWAP_TO_AMOUNT,
  TRANSACTION_ID,
  DEPOSIT_ADDRESS,
  NEED_HELP_CONTACT,
  EXOLIX_EMAIL,
} from './constants';
const NUMBER_OF_LINES = 1;

const TransactionDetails: FC<ITransferInfo> = ({ transaction, onSupportLinkPress }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.amount}>
          <TextV3.BodyStrong numberOfLines={1} color={COLORS_ENUMS.BLACK}>
            {transaction?.amountTo} {transaction?.coinTo.coinCode}
          </TextV3.BodyStrong>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {STATUS_STRING}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction?.status}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SENT_TIME}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {dayjs(transaction?.createdAt).format(DATE_FORMAT)}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SWAP_FROM}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            numberOfLines={NUMBER_OF_LINES}
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction?.withdrawalAddress}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {DEPOSIT_ADDRESS}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            numberOfLines={NUMBER_OF_LINES}
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction?.depositAddress}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SWAP_FROM_AMOUNT}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            numberOfLines={NUMBER_OF_LINES}
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction?.amount} {transaction?.coinFrom?.coinCode}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {SWAP_TO_AMOUNT}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            numberOfLines={NUMBER_OF_LINES}
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction?.amountTo} {transaction?.coinTo?.coinCode}
          </TextV3.CaptionRegular>
        </View>
        <View style={styles.detailRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.detailKey}
          >
            {TRANSACTION_ID}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular
            numberOfLines={NUMBER_OF_LINES}
            color={COLORS_ENUMS.DARK_GRAY_200}
            extraStyles={styles.detailValue}
          >
            {transaction.id}
          </TextV3.CaptionRegular>
        </View>
        <TouchableOpacity style={styles.supportEmail} onPress={onSupportLinkPress}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            {NEED_HELP_CONTACT}
            <TextV3.Caption color={COLORS_ENUMS.LINK_BLUE}>{EXOLIX_EMAIL}</TextV3.Caption>
          </TextV3.Caption>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TransactionDetails;
