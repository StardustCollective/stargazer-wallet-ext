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
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray_light,
    borderRadius: 6,
  },
  menuIconSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray_dark,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 12,
  },
  arrowRightWrapper: {
    backgroundColor: 'transparent',
    justifySelf: 'flex-end',
    width: 22,
    height: 22,
  },
  arrowRightIcon: {
    color: COLORS.gray_100,
  },
  icon: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  text: {
    flexGrow: 1,
  },
  firstChild: {
    marginTop: 24,
    marginBottom: 24,
  },
  lastChild: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  secondChild: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default styles;
