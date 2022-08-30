///////////////////////
// Imports
///////////////////////

import React, { FC, useState } from 'react';
///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import CurrencyImport from 'components/CurrencyInput'

///////////////////////
// Images
///////////////////////

// const exolixLogo = require('assets/images/exolixLogo.png');
// import SwapArrows from 'assets/images/svg/swapArrows.svg';
import ExolixLogo from 'assets/images/exolixLogo.png';
import SwapArrows from 'assets/images/svg/swapArrows.svg';

///////////////////////
// Types
///////////////////////

import ISwapTokens from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './swapTokens.scss';

///////////////////////
// constants
///////////////////////

import {
  SWAP_FROM_STRING,
  BALANCE_STRING,
  SWAP_TO_STRING,
  RATE_STRING,
  MINIMUM_AMOUNT_STRING
} from './constants';

const EXOLIX_LOGO_WIDTH = 80;
const EXOLIX_LOGO_HEIGHT = 32;


const SwapTokens: FC<ISwapTokens> = ({ }) => {

  const [fromInputValue, setFromInputValue] = useState('');

  const fromOnChangeText = (e: any) => {
    setFromInputValue(e.target.value);
  };

  const onSwapFromPress = () => {
    console.log('On From Press');
  }

  return (
    <div className={styles.container}>
      <div className={styles.provider}>
        <div className={styles.thirdPartyTextView}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY_200}>Third Party Provider</TextV3.CaptionStrong>
        </div>
        <div className={styles.exolixTextView}>
          <img src={`/${ExolixLogo}`} alt="exolix" width={EXOLIX_LOGO_WIDTH} height={EXOLIX_LOGO_HEIGHT} />
        </div>
      </div>
      <div className={styles.fromInputLabels}>
        <div className={styles.fromInputSwapFromLabel}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {SWAP_FROM_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.fromInputBalanceLabel}>
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY_200}>
            {BALANCE_STRING} 1 ETH
          </TextV3.Caption>
        </div>
      </div>
      <CurrencyImport tickerValue='DAG' onPress={onSwapFromPress} containerStyle={styles.fromCurrencyInputContainer} placeholder='0' value={fromInputValue} onChangeText={fromOnChangeText} />
      <div className={styles.toInputLabels}>
        <div className={styles.toInputSwapLabel}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {SWAP_TO_STRING}
          </TextV3.CaptionStrong>
        </div>
        <div className={styles.swapIcon}>
          <img src={`/${SwapArrows}`} />
        </div>
        <div className={styles.toBlank} />
      </div>
      <CurrencyImport tickerValue='DAG' onPress={onSwapFromPress} containerStyle={styles.toCurrencyInputContainer} placeholder='0' value={fromInputValue} onChangeText={fromOnChangeText} />
      <div className={styles.rate}>
          <div className={styles.rateLabel}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}>
              {RATE_STRING}
            </TextV3.CaptionStrong>
          </div>
          <div className={styles.rateValue}>
            <TextV3.Caption
              color={COLORS_ENUMS.DARK_GRAY_200}>
              1 ETH ≈ 3,076.9006 DAG
            </TextV3.Caption>
          </div>
        </div>
        <div className={styles.minimumAmount}>
          <div className={styles.minimumAmountLabel}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.DARK_GRAY_200}>
              {MINIMUM_AMOUNT_STRING}
            </TextV3.CaptionStrong>
          </div>
          <div className={styles.minimumAmountValue}>
            <TextV3.Caption
              color={COLORS_ENUMS.DARK_GRAY_200}>
              0.06954103 ETH
            </TextV3.Caption>
          </div>
        </div>
    </div>
  );
}

export default SwapTokens;
