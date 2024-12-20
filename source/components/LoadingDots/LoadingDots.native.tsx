import React, { FC, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import LoadingDotsProps from './types';
import styles from './styles';

const LoadingDots: FC<LoadingDotsProps> = ({
  color = '#fff',
  width = 40,
  height = 8,
  containerHeight = 20,
}) => {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Infinite animation sequence for the loader
    const animate = () => {
      Animated.sequence([
        Animated.timing(scale1, {
          toValue: 0.2,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(scale2, {
            toValue: 0.2,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(scale1, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale3, {
            toValue: 0.2,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(scale2, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale3, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [scale1, scale2, scale3]);

  return (
    <View style={[styles.loadingContainer, { height: containerHeight, width }]}>
      <Animated.View
        style={[
          styles.loaderDot,
          { height, width: height, borderRadius: height / 2, backgroundColor: color },
          { transform: [{ scaleY: scale1 }, { scaleX: scale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.loaderDot,
          { height, width: height, borderRadius: height / 2, backgroundColor: color },
          { transform: [{ scaleY: scale2 }, { scaleX: scale2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.loaderDot,
          { height, width: height, borderRadius: height / 2, backgroundColor: color },
          { transform: [{ scaleY: scale3 }, { scaleX: scale3 }] },
        ]}
      />
    </View>
  );
};

export default LoadingDots;
