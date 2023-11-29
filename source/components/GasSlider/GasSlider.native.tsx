import React, { FC } from 'react';
import { View } from 'react-native';
import TextV3 from 'components/TextV3';
import PurpleSlider from 'components/PurpleSlider';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { useFiat } from 'hooks/usePrice';
import { GasSliderProps } from './types';
import { GAS_IN_GWEI, GWEI } from './constants';
import styles from './styles';

const GasSlider: FC<GasSliderProps> = ({ gas, asset, onGasPriceChange }) => {
  const getFiatAmount = useFiat(true, asset);

  const ESTIMATE_LABEL = `${gas.price} ${GWEI}, ${gas.fee} ${
    asset.symbol
  } (≈ ${getFiatAmount(gas.fee, 2, gas.basePriceId)})`;

  return (
    <View>
      <View style={styles.gasPriceContainer}>
        <View style={styles.gasPriceHeader}>
          <View style={styles.gasPriceHeaderLeft}>
            <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK}>
              {GAS_IN_GWEI}
            </TextV3.LabelSemiStrong>
          </View>
          <View style={styles.gasPriceHeaderRight}>
            <View style={styles.gasSpeedBox}>
              <View style={styles.gasSpeedBoxLeft}>
                <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
                  {gas.price.toString()}
                </TextV3.CaptionRegular>
              </View>
              <View style={styles.gasSpeedBoxRight}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {gas.speedLabel}
                </TextV3.CaptionStrong>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.gasPriceFooter}>
          <View>
            <PurpleSlider
              onChange={onGasPriceChange}
              min={gas.prices[0]}
              max={gas.prices[2]}
              value={gas.price}
              step={1}
            />
          </View>
        </View>
      </View>
      <TextV3.CaptionRegular
        extraStyles={styles.gasEstimateLabel}
        color={COLORS_ENUMS.DARK_GRAY_200}
      >
        {ESTIMATE_LABEL}
      </TextV3.CaptionRegular>
    </View>
  );
};

export default GasSlider;
