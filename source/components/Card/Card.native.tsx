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
}

/// ////////////////////
// Component
/// ////////////////////

const CardComponent = ({ id, children, onClick, style = {} }: ICardProps) => {
  const wrapperStyle = StyleSheet.flatten([styles.wrapperStyle, style]);

  return (
    <TouchableOpacity testID={id} onPress={onClick}>
      <Card containerStyle={styles.containerStyle} wrapperStyle={wrapperStyle}>
        {children}
      </Card>
    </TouchableOpacity>
  );
};

export default CardComponent;
