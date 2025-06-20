import React, { FC } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import PurpleSlider from 'components/PurpleSlider';
import TextV3 from 'components/TextV3';

import { useFiat } from 'hooks/usePrice';

import { trimTrailingZeros } from 'utils/number';

import { GAS_IN_GWEI, GWEI } from './constants';
import styles from './GasSlider.scss';
import { GasSliderProps } from './types';

const GasSlider: FC<GasSliderProps> = ({ gas, onGasPriceChange }) => {
  const getFiatAmount = useFiat();
  const gasValue = trimTrailingZeros(gas.fee.toFixed(18));

  const ESTIMATE_LABEL = `${gas.price} ${GWEI}, ${gasValue} ${gas.symbol} (≈ ${getFiatAmount(gas.fee, 2, gas.basePriceId)})`;

  return (
    <div>
      <div className={styles.gasPriceContainer}>
        <div className={styles.gasPriceHeader}>
          <div className={styles.gasPriceHeaderLeft}>
            <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK}>{GAS_IN_GWEI}</TextV3.LabelSemiStrong>
          </div>
          <div className={styles.gasPriceHeaderRight}>
            <div className={styles.gasSpeedBox}>
              <div className={styles.gasSpeedBoxLeft}>
                <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>{gas.price.toString()}</TextV3.CaptionRegular>
              </div>
              <div className={styles.gasSpeedBoxRight}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{gas.speedLabel}</TextV3.CaptionStrong>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.gasPriceFooter}>
          <div>
            <PurpleSlider onChange={onGasPriceChange} min={gas.prices[0]} max={gas.prices[2]} value={gas.price} defaultValue={gas.price} step={gas.steps} />
          </div>
        </div>
      </div>
      <div className={styles.gasEstimateLabel}>
        <TextV3.CaptionRegular color={COLORS_ENUMS.DARK_GRAY_200}>{ESTIMATE_LABEL}</TextV3.CaptionRegular>
      </div>
    </div>
  );
};

export default GasSlider;
