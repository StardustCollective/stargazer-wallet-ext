import React, { FC } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { NEW_COLORS } from 'assets/styles/_variables';
import { View } from 'react-native';
import styles from './styles';

const renderItem = () => {
  return (
    <View style={styles.content}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
            <View style={styles.circle} />
          </SkeletonPlaceholder>
        </View>
        <View style={styles.txInfoWrapper}>
          <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
            <View style={styles.boxMedium} />
          </SkeletonPlaceholder>
          <View style={styles.divider} />
          <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
            <View style={styles.boxSmall} />
          </SkeletonPlaceholder>
        </View>
      </View>
      <View style={styles.txAmountWrapper}>
        <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
          <View style={styles.boxMedium} />
        </SkeletonPlaceholder>
        <View style={styles.divider} />
        <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
          <View style={styles.boxSmall} />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

const LoadingTxItem: FC = () => {
  return (
    <View>
      <View style={styles.txItem}>
        <View style={styles.groupBar}>
          <SkeletonPlaceholder backgroundColor={NEW_COLORS.light_gray}>
            <View style={styles.boxMedium} />
          </SkeletonPlaceholder>
        </View>
        {renderItem()}
        {renderItem()}
        {renderItem()}
      </View>
    </View>
  );
};

export default LoadingTxItem;
