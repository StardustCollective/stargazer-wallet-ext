import React, { FC } from 'react';
import { View, Linking } from 'react-native';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import CameraIcon from 'assets/images/svg/camera.svg';
import styles from './styles';
import IEnableCamera from './types';

const EnableCamera: FC<IEnableCamera> = ({ onPress }): JSX.Element => {
  const onGoToSettingPressed = async () => {
    if (onPress) {
      onPress();
    }
    await Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <CameraIcon height={50} width={50} />
      <TextV3.Header extraStyles={styles.headerText}>Enable camera</TextV3.Header>
      <TextV3.Body align={TEXT_ALIGN_ENUM.CENTER} extraStyles={styles.bodyText}>
        Please enable access to your camera to use the Scan QR Code feature.
      </TextV3.Body>
      <ButtonV3
        type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        title="Go to Settings"
        onPress={onGoToSettingPressed}
      />
    </View>
  );
};

export default EnableCamera;
