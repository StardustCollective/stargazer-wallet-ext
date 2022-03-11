import { COLORS } from 'assets/styles/_variables';
import { StyleProp, ViewStyle } from 'react-native';

export default interface IQRCodeButton {
  onPress: () => void;
  size: number;
  color: COLORS;
  style: StyleProp<ViewStyle>;
}