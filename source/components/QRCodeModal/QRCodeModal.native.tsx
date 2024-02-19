///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, Text } from 'react-native';

///////////////////////////
// Components
///////////////////////////

///////////////////////////
// Types
///////////////////////////

import { IQRCodeModal } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const QRCodeModal: FC<IQRCodeModal> = ({
  open,
  address,
  onClose,
  copyAddress,
  textTooltip,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////
  console.log({ open, address, onClose, copyAddress, textTooltip });
  return (
    <View style={styles.container}>
      <Text>test</Text>
    </View>
  );
};

export default QRCodeModal;
