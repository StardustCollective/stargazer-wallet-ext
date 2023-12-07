///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////
// Images
///////////////////////

// import ImagePlaceholder from 'assets/images/placeholder.png';

///////////////////////
// Types
///////////////////////

import ITransferInfo from './types';

///////////////////////
// Helpers
///////////////////////

import { ellipsis } from '../../home/helpers';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './ConfirmDetails.scss';

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
    <div className={styles.container}>
      <div className={styles.amount}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
          {tempTx?.amount} {assetInfo.symbol}
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
            {' '}
            (≈
            {getSendAmount()})
          </TextV3.Caption>
        </TextV3.BodyStrong>
      </div>
      <div className={styles.detailRow}>
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
      </div>
      <div className={styles.detailRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.detailKey}
        >
          {SEND_TO_STRING}
        </TextV3.CaptionStrong>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.DARK_GRAY_200}
          extraStyles={styles.detailValue}
        >
          {tempTx?.toAddress}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.detailRow}>
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
      </div>
      <div className={styles.detailRow}>
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
      </div>
      <div className={styles.detailRowMaxTotal}>
        <div className={styles.detailRowLeft}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY}>
            {MAX_TOTAL_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.detailRowRight}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>
            {tempTx?.amount} {assetInfo.symbol}
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
            ≈ {`$${getTotalAmount()}`}
          </TextV3.Caption>
        </div>
      </div>
      <div className={styles.nextButton}>
        <ButtonV3
          label={CANCEL_BUTTON_STRING}
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          onClick={onCancelPressed}
        />
        <ButtonV3
          label={SWAP_BUTTON_STRING}
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          loading={isSwapButtonLoading}
          disabled={isSwapButtonLoading}
          onClick={onSwapPressed}
        />
      </div>
    </div>
  );
};

export default ConfirmDetails;
