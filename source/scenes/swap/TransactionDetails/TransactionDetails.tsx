///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
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
import styles from './TransactionDetails.scss';

///////////////////////
// constants
///////////////////////

import {
  DATE_FORMAT,
  STATUS_STRING,
  SENT_TIME,
  SWAP_FROM,
  DEPOSIT_ADDRESS,
  SWAP_FROM_AMOUNT,
  SWAP_TO_AMOUNT,
  TRANSACTION_ID,
} from './constants';

const TransactionDetails: FC<ITransferInfo> = ({
  transaction
}) => {

  return (
    <div className={styles.container}>
      <div className={styles.amount}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
          {transaction?.amountTo}{' '}{transaction?.coinTo.coinCode}
        </TextV3.BodyStrong>
      </div>
      <div className={styles.detailRow}>
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
      </div>
       <div className={styles.detailRow}>
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
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {SWAP_FROM}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {transaction?.withdrawalAddress}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {DEPOSIT_ADDRESS}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {transaction?.depositAddress}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {SWAP_FROM_AMOUNT}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {transaction?.amount} {transaction?.coinFrom?.coinCode}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {SWAP_TO_AMOUNT}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {transaction?.amountTo} {transaction?.coinTo?.coinCode}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {TRANSACTION_ID}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {transaction?.id}
        </TextV3.CaptionRegular>
      </div>
    </div>
  );
}

export default TransactionDetails;
