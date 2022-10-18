import React, { ChangeEvent, FC } from 'react';
import { View } from 'react-native';
import { Slider } from 'react-native-elements';
import { COLORS } from 'assets/styles/_variables';

import styles from './styles';

type IPurpleSliderProps = {
  max: number;
  min: number;
  onChange: (_event: ChangeEvent<{}>, value: number | number[]) => void;
  step: number;
  value: number;
};

const PurpleSlider: FC<IPurpleSliderProps> = ({ onChange, min, max, value, step }) => {
  return (
    <View style={[styles.contentView]}>
      <Slider
        value={value}
        onValueChange={(val) => onChange({} as ChangeEvent, val)}
        maximumValue={max}
        minimumValue={min}
        step={step}
        allowTouchTrack
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        minimumTrackTintColor={COLORS.purple_light_2}
        thumbProps={{}}
      />
    </View>
  );
};

export default PurpleSlider;
