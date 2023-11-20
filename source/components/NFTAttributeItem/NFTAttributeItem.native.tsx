import React, { FC } from 'react';
import { View } from 'react-native';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { INFTAttributeItem } from './types';
import styles from './styles';

const NFTAttributeItem: FC<INFTAttributeItem> = ({ type, value }) => {
  return (
    <View style={styles.container}>
      <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT} extraStyles={styles.typeText}>
        {type.toUpperCase()}
      </TextV3.Caption>
      <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.valueText}>
        {value}
      </TextV3.BodyStrong>
    </View>
  );
};

export default NFTAttributeItem;
