import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { NFTSendConfirmProps } from './types';
import {
  MAX_TOTAL,
  NETWORK,
  QUANTITY,
  SEND_FROM,
  SEND_TO,
  SUBMIT,
  TRANSACTION_FEE,
} from './constants';
import styles from './NFTSendConfirm.scss';

const NFTSendConfirm: FC<NFTSendConfirmProps> = ({
  network,
  quantity,
  sendFrom,
  sendTo,
  transactionFee,
  maxTotal,
  nftLogo,
  nftName,
  loading,
  isERC721,
  onButtonPress,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={nftLogo} className={styles.image} />
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {nftName}
        </TextV3.CaptionStrong>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.detailRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {NETWORK}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {network}
          </TextV3.CaptionRegular>
        </div>
        {!isERC721 && (
          <div className={styles.detailRow}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              {QUANTITY}
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
              {quantity}
            </TextV3.CaptionRegular>
          </div>
        )}
        <div className={styles.detailRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {SEND_FROM}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {sendFrom}
          </TextV3.CaptionRegular>
        </div>
        <div className={styles.detailRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {SEND_TO}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {sendTo}
          </TextV3.CaptionRegular>
        </div>
        <div className={styles.detailRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {TRANSACTION_FEE}
          </TextV3.CaptionStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {transactionFee}
          </TextV3.CaptionRegular>
        </div>
        <div className={styles.detailRow}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {MAX_TOTAL}
          </TextV3.CaptionStrong>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {maxTotal}
          </TextV3.CaptionStrong>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          label={SUBMIT}
          disabled={loading}
          loading={loading}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onButtonPress}
        />
      </div>
    </div>
  );
};

export default NFTSendConfirm;
