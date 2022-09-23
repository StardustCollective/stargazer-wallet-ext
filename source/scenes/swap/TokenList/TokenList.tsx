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

import IConfirmationInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './TokenList.scss';

///////////////////////
// constants
///////////////////////

import {
  SEARCH_STRING
} from './constants';

const ConfirmDetails: FC<IConfirmationInfo> = ({
  onTokenCellPressed
}) => {

  return (
    <div className={styles.container}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK}>Token List</TextV3.Caption>
    </div>
  );
}

export default ConfirmDetails;
