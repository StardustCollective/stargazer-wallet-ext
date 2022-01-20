/// ////////////////////
// Modules
/// ////////////////////

import React from 'react';
import {  Card } from 'react-native-elements';
import { View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
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
}

/// ////////////////////
// Component
/// ////////////////////

const CardComponent = ({ id, children, onClick }: ICardProps) => {
  return (
    <TouchableWithoutFeedback 
        testID={id} onPress={onClick}>
        <Card containerStyle={styles.card}>
            {children}
        </Card>
    </TouchableWithoutFeedback>
  );
};

export default CardComponent
