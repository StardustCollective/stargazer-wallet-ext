// Place holder file for Web.
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import QRCodeIcon from 'assets/images/svg/qr-code.svg';
import { COLORS } from 'assets/styles/_variables';
import IQRCodeButton from './types';

const QRCodeButton: FC<IQRCodeButton> = ({
  onPress,
  size = 25,
  color = COLORS.purple,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <QRCodeIcon height={size} width={size} fill={color} />
    </TouchableOpacity>
  );
};

export default QRCodeButton;
