import { Platform } from 'react-native';

export const iosPlatform = (): boolean => {
  return Platform.OS === 'ios';
};

export const androidPlatform = (): boolean => {
  return Platform.OS === 'android';
};

export const getPlatform = (): string => {
  return Platform.OS;
};
