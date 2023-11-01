import React, { FC } from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import CheckmarkIcon from 'assets/images/svg/check-green.svg';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import LaunchIcon from 'assets/images/svg/launch.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { NFTSendCompletedProps } from './types';
import { ellipsis } from 'scenes/home/helpers';
import {
  FINISH,
  ICON_SIZE,
  TRANSFER_COMPLETED,
  VIEW_TRANSACTION,
  WAS_SUCCESSFUL,
  YOUR_TOKEN_TRANSFER,
} from './constants';
import styles from './NFTSendCompleted.scss';

const NFTSendCompleted: FC<NFTSendCompletedProps> = ({
  address,
  onViewTransactionPress,
  onButtonPress,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <img src={`/${CheckmarkIcon}`} height={ICON_SIZE} width={ICON_SIZE} />
        <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {TRANSFER_COMPLETED}
        </TextV3.Header>
        <TextV3.CaptionRegular
          align={TEXT_ALIGN_ENUM.CENTER}
          color={COLORS_ENUMS.SECONDARY_TEXT}
          extraStyles={styles.subtitle}
        >
          {YOUR_TOKEN_TRANSFER} {ellipsis(address)} {WAS_SUCCESSFUL}
        </TextV3.CaptionRegular>
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          label={VIEW_TRANSACTION}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          onClick={onViewTransactionPress}
          extraTitleStyles={styles.viewTxTitle}
          extraStyle={styles.viewTxButton}
          rightIcon={<img src={`/${LaunchIcon}`} />}
        />
        <ButtonV3
          label={FINISH}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onButtonPress}
        />
      </div>
    </div>
  );
};

export default NFTSendCompleted;
