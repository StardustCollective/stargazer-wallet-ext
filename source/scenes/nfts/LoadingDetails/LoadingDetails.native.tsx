import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { NEW_COLORS } from 'assets/styles/_variables';
import styles from './styles';

const LoadingDetails = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
        <View style={styles.image} />
      </SkeletonPlaceholder>
      <View style={styles.titleContainer}>
        <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
          <View style={styles.title} />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
          <View style={styles.subtitle} />
        </SkeletonPlaceholder>
      </View>
      <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
        <View style={styles.button} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
        <View style={styles.descriptionTitle} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
        <View style={styles.description} />
      </SkeletonPlaceholder>
    </View>
  );
};

export default LoadingDetails;
