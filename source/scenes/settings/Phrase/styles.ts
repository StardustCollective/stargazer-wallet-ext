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
    fontFamily: FONTS.rubik,
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
    backgroundColor: COLORS.primary_light,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
});

export default styles;
