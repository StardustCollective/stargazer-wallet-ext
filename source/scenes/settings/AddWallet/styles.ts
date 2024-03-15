import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    overflow: 'scroll',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.gray_light}`,
    borderRadius: 6,
    marginBottom: 12,
  },
  menuText: {
    lineHeight: 24,
    color: COLORS.gray_dark,
    fontWeight: '500',
    fontSize: 16,
    flexGrow: 1,
    fontFamily: FONTS.inter,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
  },
  text: {
    fontFamily: FONTS.inter,
    flexGrow: 1,
  },
  stargazerIconWrapper: {
    backgroundColor: COLORS.primary,
    marginRight: 12,
    borderRadius: 18,
    height: 36,
    width: 36,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
