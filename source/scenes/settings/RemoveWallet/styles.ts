import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  removeAccount: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    paddingHorizontal: 36,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  wrapper: {
    flexGrow: 1,
  },
  subheading: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24,
    width: '100%',
    padding: 0,
    alignItems: 'flex-start',
  },
  accountNameWrapper: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderStyle: 'solid',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 36,
  },
  accountName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 36,
    letterSpacing: 0.03,
    color: COLORS.gray_dark,
  },
  formText: {
    marginTop: 24,
    marginHorizontal: 0,
  },
  bold: {
    fontWeight: '500',
    color: COLORS.red_100,
  },
  inputWrapper: {
    marginTop: 0,
    marginBottom: -24,
  },
  input: {
    width: '100%',
  },
  actions: {
    position: 'relative',
    bottom: 24,
    marginTop: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-evenly',
  },
});

export default styles;
