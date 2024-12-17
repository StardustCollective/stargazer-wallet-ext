import React, { FC } from 'react';
import { View, Switch } from 'react-native';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables.native';
import { IPersonalize } from './types';
import { TITLE, ITEM_TEXT } from './constants';
import styles from './styles';

const Personalize: FC<IPersonalize> = ({ hidden, toggleHideElpacaCard }) => {
  return (
    <View style={styles.wrapper}>
      <TextV3.CaptionStrong
        color={COLORS_ENUMS.SECONDARY_TEXT}
        extraStyles={styles.title}
      >
        {TITLE}
      </TextV3.CaptionStrong>
      <View style={styles.cardContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          {ITEM_TEXT}
        </TextV3.CaptionStrong>
        <Switch
          value={hidden}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.purple_light}
          trackColor={{ true: COLORS.primary_lighter_1, false: COLORS.purple_light }}
          onValueChange={toggleHideElpacaCard}
        />
      </View>
    </View>
  );
};

export default Personalize;
