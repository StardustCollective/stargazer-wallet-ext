import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import styles from './styles';

interface ILink {
  id?: string;
  color?: 'primary' | 'secondary' | 'monotoneOne';
  title: string;
  onPress?: () => void;
  extraStyles?: string;
}

const Link: FC<ILink> = ({ id, color = 'primary', onPress, extraStyles, title }) => {
  const flatLinkStyles = StyleSheet.flatten([styles.link, styles[color]]);

  const composedLinkStyles = StyleSheet.compose(flatLinkStyles, extraStyles);

  return (
    <>
      <TouchableOpacity testID={id} onPress={onPress}>
        <Text style={composedLinkStyles}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};

export default Link;
