import { StyleProp, ViewStyle } from 'react-native';

export default interface IQRCodeButton {
  onPress: () => void;
  size: number;
  color: string;
  style: StyleProp<ViewStyle>;
}
