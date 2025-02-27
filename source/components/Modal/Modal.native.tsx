import React, { FC } from 'react';
import { View } from 'react-native';
import RNModal from 'react-native-modal';
import { IModal } from './types';
import styles from './styles';

const Modal: FC<IModal> = ({
  visible,
  children,
  containerStyle = {},
  onBackdropPress = undefined,
}) => {
  if (!visible) return null;

  return (
    <RNModal
      isVisible={visible}
      statusBarTranslucent
      backdropOpacity={0.5}
      onBackdropPress={onBackdropPress}
    >
      <View style={[styles.content, containerStyle]}>{children}</View>
    </RNModal>
  );
};

export default Modal;
