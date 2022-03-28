import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_100,
    paddingHorizontal: 36,
    paddingVertical: 0,
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
  },
  text: {
    lineHeight: 18,
    marginBottom: 12,
  },
  accountNameWrapper: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
  },
  accountName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.03,
    color: COLORS.gray_dark,
    marginBottom: 8,
    marginTop: 8,
  },
  copied: {
    backgroundColor: COLORS.purple_medium,
    color: COLORS.purple,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 24,
  },
  contentText: {
    marginBottom: 12,
    marginTop: 24,
  },
  span: {
    marginVertical: 16,
    marginHorizontal: 0,
  },
  privKey: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  privKeyText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: 0.03,
  },
  notAllowed: {},
  privKeyCopied: {
    backgroundColor: COLORS.purple_medium,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  privKeyCopiedText: {
    color: COLORS.purple,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 12,
    maxWidth: 144,
  },
});

export default styles;
