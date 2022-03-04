import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  newAccount: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 36,
    paddingVertical: 0,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  newAccountSubWrapper: {
    flex: 1,
  },
  text: {
    marginTop: 24,
  },
  label: {
    fontSize: 10,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
    color: COLORS.gray_dark,
    textTransform: 'uppercase',
  },
  iconWrapper: {
    backgroundColor: 'transparent',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_light,
    borderRadius: 6,
  },
  menuSectionWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuText: {
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.gray_dark,
    marginBottom: 12,
  },
  span: {
    flexGrow: 1,
  },
  svg: {
    fontSize: 16,
    color: COLORS.gray,
  },
  formSpan: {
    marginVertical: 24,
    marginHorizontal: 0,
    display: 'flex',
  },
  formText: {
    fontWeight: '500',
    color: COLORS.red_100,
  },
  address: {
    width: '100%',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: '0.03',
    color: COLORS.gray_dark,
  },
  copied: {
    background: COLORS.purple_medium,
    color: COLORS.purple,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderStyle: 'solid',
    marginTop: 24,
    marginHorizontal: -10,
    marginBottom: -24,
    paddingHorizontal: 0,
  },
  actions: {
    marginTop: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  centered: {
    justifyContent: 'center',
  },
  button: {
    marginBottom: 20,
  },
});

export default styles;
