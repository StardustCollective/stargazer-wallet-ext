import React, { FC } from 'react';
import { View } from 'react-native';
import TextV3 from 'components/TextV3';
import WarningIcon from 'assets/images/svg/warning.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IWarningMessage } from './types';
import styles from './styles';

const WarningMessage: FC<IWarningMessage> = ({ message }) => {
  return (
    <View style={styles.container}>
      <WarningIcon width={24} height={24} style={styles.warningIcon} />
      <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
        {message}
      </TextV3.CaptionRegular>
    </View>
  );
};

export default WarningMessage;
