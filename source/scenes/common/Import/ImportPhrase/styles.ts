import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    flexGrow: 1,
    marginHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  buttonContainer: {
    marginVertical: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dropdownContainer: {
    height: 60,
    marginTop: 20,
    zIndex: 2,
  },
  itemContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 48,
    width: 176,
    borderRadius: 8,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  phraseInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  button: {
    width: 358,
  },
  errorLabel: {
    marginTop: 20,
  },
  inputFocused: {
    borderColor: COLORS.primary_lighter_1,
  },
  passwordIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    alignSelf: 'center',
  },
});

export default styles;
