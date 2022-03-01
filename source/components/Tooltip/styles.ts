import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tooltip: {
    opacity: 0.95,
    // fontFamily: FONTS.quicksand,
    color: COLORS.white,
    borderRadius: 3,
    fontSize: 12,
    paddingRight: 12,
    paddingLeft: 12,
  },
  arrow: {
    color: COLORS.gray_dark,
    width: 14,
    height: 10,
  },
});

export default styles;
