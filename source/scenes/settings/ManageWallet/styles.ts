import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'scroll',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  label: {
    fontFamily: FONTS.rubik,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  inputContainer: {
    border: `1px solid ${COLORS.gray_200}`,
    marginHorizontal: -10, // compensate for View container at 10px padding
    marginBottom: 0,
    position: 'relative',
    lineHeight: 24,
  },
  text: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: FONTS.rubik,
    lineHeight: 16,
  },
  menu: {
    display: 'flex',
    paddingHorizontal: 0,
    paddingVertical: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.gray_light}`,
    borderRadius: 6,
  },
  menuText: {
    lineHeight: 24,
    color: COLORS.gray_dark,
    fontWeight: '500',
    fontSize: 16,
    flexGrow: 1,
    fontFamily: FONTS.rubik,
  },
  icon: {
    fontSize: 24,
    color: COLORS.gray,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
    color: COLORS.gray_dark,
  },
  buttonCancelText: {
    color: COLORS.gray_dark,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    marginRight: 10,
    marginBottom: 20,
    width: 144,
  },
});

export default styles;
