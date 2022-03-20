import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  linkIcon: {
    marginRight: 10,
  },
  active: {
    backgroundColor: COLORS.gray_light,
  },
  svg: {
    color: COLORS.gray,
  },
  qrIcon: {
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;
