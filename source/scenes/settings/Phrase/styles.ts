import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  phrase: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 0,
    paddingHorizontal: 36,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray_light_100,
  },
  phraseText: {
    fontFamily: FONTS.inter,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.gray_dark,
  },
  text: {
    marginVertical: 24,
    marginHorizontal: 0,
  },
  seed: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray_200,
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  seedText: {
    textAlign: 'center',
    fontWeight: '500',
    color: COLORS.gray_dark,
    fontSize: 12,
    lineHeight: 24,
  },
  notAllowed: {
    // cursor: 'no-drop',
  },
  copied: {
    backgroundColor: COLORS.purple_medium,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  copiedText: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 12,
    maxWidth: 144,
  },
});

export default styles;
