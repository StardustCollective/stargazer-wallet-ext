import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 24,
    flexDirection: 'column',
    overflow: 'scroll',
    paddingHorizontal: 24,
    paddingVertical: 0,
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
    fontFamily: FONTS.rubik,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
  },
  icon: {
    fontSize: 16,
    color: COLORS.gray,
    backgroundColor: 'white',
  },
  text: {
    fontFamily: FONTS.rubik,
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
// text: {
//   marginTop: 12,
//   marginBottom: 24,
//   fontSize: 12,
//   fontWeight: '500',
//   fontFamily: FONTS.rubik,
//   lineHeight: 16,
// },
// iconWrapper: {
//   backgroundColor: 'transparent',
// },

export default styles;
