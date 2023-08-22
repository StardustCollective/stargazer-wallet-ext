import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: 48,
    width: 170,
    borderRadius: 8,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  inputFocused: {
    borderColor: COLORS.primary_lighter_1,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  indexText: {
    alignSelf: 'center',
  },
  phraseInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  passwordIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
