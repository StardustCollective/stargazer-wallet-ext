import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';

import PurpleSlider from 'components/PurpleSlider';
import TextV3 from 'components/TextV3';

import { useFiat } from 'hooks/usePrice';

import { trimTrailingZeros } from 'utils/number';

import Card from '../Card';

import styles from './GasSlider.scss';
import { GasSliderProps } from './types';

const GasSlider: FC<GasSliderProps> = ({ gas, loading = false, onGasPriceChange }) => {
  const getFiatAmount = useFiat();
  const gasValue = trimTrailingZeros(gas.fee.toFixed(18));

  const ESTIMATE_LABEL = `${gas.price} GWEI, ${gasValue} ${gas.symbol} (≈ ${getFiatAmount(gas.fee, 2, gas.basePriceId)})`;

  return (
    <>
      <Card>
        <div className={styles.gasPriceHeader}>
          <div className={styles.gasPriceHeaderLeft}>
            <TextV3.CaptionStrong extraStyles={styles.label}>Gas Price (in GWEI)</TextV3.CaptionStrong>
          </div>
          <div className={styles.gasPriceHeaderRight}>
            {loading ? (
              <Skeleton variant="rect" animation="wave" height={30} width={120} style={{ borderRadius: 6 }} />
            ) : (
              <div className={styles.gasSpeedBox}>
                <div className={styles.gasSpeedBoxLeft}>
                  <TextV3.CaptionRegular extraStyles={styles.price}>{gas.price.toString()}</TextV3.CaptionRegular>
                </div>
                <div className={styles.gasSpeedBoxRight}>
                  <TextV3.CaptionStrong extraStyles={styles.speed}>{gas.speedLabel}</TextV3.CaptionStrong>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.gasPriceFooter}>
          {loading ? (
            <Skeleton variant="rect" animation="wave" height={14} width={280} style={{ borderRadius: 4, marginTop: 8, marginBottom: 11 }} />
          ) : (
            <div>
              <PurpleSlider onChange={onGasPriceChange} min={gas.prices[0]} max={gas.prices[2]} value={gas.price} defaultValue={gas.price} step={gas.steps} />
            </div>
          )}
        </div>
      </Card>
      <div className={styles.gasEstimateLabel}>
        {loading ? <Skeleton variant="rect" animation="wave" height={14} width={220} style={{ borderRadius: 4 }} /> : <TextV3.CaptionRegular extraStyles={styles.estimateLabel}>{ESTIMATE_LABEL}</TextV3.CaptionRegular>}
      </div>
    </>
  );
};

export default GasSlider;
