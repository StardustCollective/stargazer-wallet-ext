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

import CheckCircle from 'assets/images/svg/check-circle.svg';

///////////////////////
// Types
///////////////////////

import IConfirmationInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './Confirmation.scss';

///////////////////////
// constants
///////////////////////

import {
  YOUR_TOKEN_SWAP_STRING,
  STATUS_OF_YOUR_TRASACTION_STRING,
  VIEW_SWAP_HISTORY_STRING,
  DONE_STRING,
} from './constants';

const CHECK_CIRCLE_WIDTH = 78;

const ConfirmDetails: FC<IConfirmationInfo> = ({
  onViewSwapHistoryPressed,
  onDonePressed,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={`/${CheckCircle}`} alt="check_circle" width={CHECK_CIRCLE_WIDTH} />
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
      </div>
      <div className={styles.buttons}>
        <ButtonV3
          label={VIEW_SWAP_HISTORY_STRING}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onViewSwapHistoryPressed}
          extraStyle={styles.viewHistoryButton}
        />
        <ButtonV3
          label={DONE_STRING}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          onClick={onDonePressed}
        />
      </div>
    </div>
  );
};

export default ConfirmDetails;
