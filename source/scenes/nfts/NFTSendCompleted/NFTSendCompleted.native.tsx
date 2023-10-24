import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import CheckmarkIcon from 'assets/images/svg/check-green.svg';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import LaunchIcon from 'assets/images/svg/launch.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { NFTSendCompletedProps } from './types';
import { ellipsis } from 'scenes/home/helpers';
import {
  FINISH,
  ICON_SIZE,
  TRANSFER_COMPLETED,
  VIEW_TRANSACTION,
  WAS_SUCCESSFUL,
  YOUR_TOKEN_TRANSFER,
} from './constants';
import styles from './styles';

const NFTSendCompleted: FC<NFTSendCompletedProps> = ({
  address,
  onViewTransactionPress,
  onButtonPress,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.textContainer}>
        <CheckmarkIcon height={ICON_SIZE} width={ICON_SIZE} />
        <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {TRANSFER_COMPLETED}
        </TextV3.Header>
        <TextV3.CaptionRegular
          align={TEXT_ALIGN_ENUM.CENTER}
          color={COLORS_ENUMS.SECONDARY_TEXT}
          extraStyles={styles.subtitle}
        >
          {YOUR_TOKEN_TRANSFER} {ellipsis(address)} {WAS_SUCCESSFUL}
        </TextV3.CaptionRegular>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonV3
          title={VIEW_TRANSACTION}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          onPress={onViewTransactionPress}
          extraTitleStyles={styles.viewTxTitle}
          extraStyles={styles.viewTxButton}
          icon={<LaunchIcon />}
          iconRight
        />
        <ButtonV3
          title={FINISH}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onPress={onButtonPress}
        />
      </View>
    </ScrollView>
  );
};

export default NFTSendCompleted;
