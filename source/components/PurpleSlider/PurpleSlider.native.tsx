import React, { ChangeEvent, FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider, Text, Icon } from 'react-native-elements';

import styles from './styles';

type IPurpleSliderProps = {
  max: number;
  min: number;
  onChange: (_event: ChangeEvent<{}>, value: number | number[]) => void;
  step: number;
  value: number;
};

const PurpleSlider: FC<IPurpleSliderProps> = ({
  onChange,
  min,
  max,
  value,
  step,
}) => {
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
        thumbProps={{}}
      />
    </View>
  );
};

export default PurpleSlider;
