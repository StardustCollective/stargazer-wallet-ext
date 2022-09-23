///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

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

import ISwapHistory from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './SwapHistory.scss';

///////////////////////
// constants
///////////////////////

import {
  TODAY_STRING,
  YESTERDAY_STRING,
  PROCESSING_STRING,
} from './constants';

const CHECK_CIRCLE_WIDTH = 78;

const ConfirmDetails: FC<ISwapHistory> = ({
}) => {

  return (
    <div className={styles.container}>
      <span>Swap History</span>
    </div>
  );
}

export default ConfirmDetails;
