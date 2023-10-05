import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { CollectionsProps } from './types';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

const Collections: FC<CollectionsProps> = ({}) => {
  return (
    <ScrollView style={styles.container}>
      <TextV3.Header color={COLORS_ENUMS.BLACK}>My NFTs</TextV3.Header>
    </ScrollView>
  );
};

export default Collections;
