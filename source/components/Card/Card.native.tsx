/// ////////////////////
// Modules
/// ////////////////////

import React from 'react';
import { Card } from 'react-native-elements';
import { StyleSheet, TouchableOpacity } from 'react-native';
/// ////////////////////
// Styles
/// ////////////////////

import styles from './styles';

/// ////////////////////
// Interface
/// ////////////////////
interface ICardProps {
  children?: React.ReactNode;
  id?: string;
  onClick?: () => void;
  style: {};
  disabled: boolean;
  disabledStyle?: StyleSheet | {};
}

/// ////////////////////
// Component
/// ////////////////////

const CardComponent = ({
  id,
  children,
  onClick,
  style = {},
  disabled = false,
  disabledStyle = {},
}: ICardProps) => {
  const wrapperStyle = StyleSheet.flatten([styles.wrapperStyle, style]);
  const containerStyle = StyleSheet.flatten([styles.containerStyle, disabledStyle]);

  return (
    <TouchableOpacity key={id} testID={id} onPress={onClick} disabled={disabled}>
      <Card containerStyle={containerStyle} wrapperStyle={wrapperStyle}>
        {children}
      </Card>
    </TouchableOpacity>
  );
};

export default CardComponent;
