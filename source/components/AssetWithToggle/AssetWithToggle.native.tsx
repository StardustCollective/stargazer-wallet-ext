///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View, Image, Switch } from 'react-native';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { COLORS } from 'assets/styles/_variables.native';
import IAssetWithToggle from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Component
///////////////////////

const AssetWithToggle: FC<IAssetWithToggle> = ({
  id,
  symbol,
  network,
  logo,
  selected,
  disabled = false,
  toggleItem,
}: IAssetWithToggle) => {
  return (
    <Card style={styles.cardContainer} id={`${id}-${network}`} disabled>
      <View style={styles.assetIcon}>
        <Image style={styles.imageIcon} source={{ uri: logo }} />
      </View>
      <View style={styles.assetInfo}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{symbol}</TextV3.CaptionStrong>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
          {!!network && `${network}`}
        </TextV3.Caption>
      </View>
      <View style={styles.toggleContainer}>
        <Switch
          disabled={disabled}
          value={selected}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.purple_light}
          trackColor={{
            true: disabled ? COLORS.primary_lighter_3 : COLORS.primary_lighter_1,
            false: COLORS.purple_light,
          }}
          onValueChange={toggleItem}
        />
      </View>
    </Card>
  );
};

export default AssetWithToggle;
