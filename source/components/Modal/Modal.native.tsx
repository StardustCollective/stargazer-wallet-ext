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
  return (
    <View style={styles.container}>
      <RNModal
        isVisible={visible}
        statusBarTranslucent
        backdropOpacity={0.5}
        onBackdropPress={onBackdropPress}
      >
        <View style={[styles.content, containerStyle]}>{children}</View>
      </RNModal>
    </View>
  );
};

export default Modal;
