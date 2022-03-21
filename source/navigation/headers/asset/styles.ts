import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';
import { scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  linkIcon: {
    marginRight: scale(10),
  },
  active: {
    backgroundColor: COLORS.gray_light,
  },
  svg: {
    color: COLORS.gray,
  },
  qrIcon: {
    marginRight: scale(8),
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;
