import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  linkIcon: {
    paddingRight: 20,
  },
  active: {
    backgroundColor: COLORS.gray_light,
  },
  svg: {
    color: COLORS.gray,
  },
  qrIcon: {
    marginRight: 20,
  }
});

export default styles;
