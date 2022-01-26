import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    background: COLORS.white,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
    padding: 0,
    height: 36,
    transition: 'all 0.3s',
    '&::before': {
      borderBottom: 'none !important',
    },
    '&::after': {
      borderBottom: 'none !important',
    },
  },
  dropDownBox: {
    borderColor: COLORS.gray_200,
    color: COLORS.gray_dark,
    // fontFamily: FONTS.inter,
    paddingTop: 10,
    paddingBottom: 10,
  },
  selectItem: {
    backgroundColor: COLORS.gray_light_100,
  },
  text: {
    paddingLeft: 16,
    color: COLORS.gray_dark,
    fontSize: 14,
    fontWeight: '500',
  },
  select: {
    height: 36,
    paddingLeft: 16,
    alignItems: 'center',
  },
  arrowIcon: {
    transition: 'all 0.3s',
    marginRight: 6,
  },
  itemContainer: {
    height: 24,
    borderTopWidth: 0,
    // '&:hover': {
    //   backgroundColor: COLORS.gray_light_100,
    // },
  },
  itemLabel: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 24,
    paddingLeft: 16,
    letterSpacing: 0.03,
    color: COLORS.gray_dark,
    // fontFamily: FONTS.inter,
    // '&:hover': {
    //   backgroundColor: COLORS.gray_light_100,
    // },
  },
});

export default styles;

