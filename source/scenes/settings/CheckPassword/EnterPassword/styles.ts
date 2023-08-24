import { StyleSheet } from 'react-native';
import { NEW_COLORS, COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 32,
    marginBottom: 10,
  },
  input: {
    marginTop: 8,
  },
  errorContainer: {
    height: 22,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 6,
    width: 170,
  },
  submit: {
    backgroundColor: NEW_COLORS.primary,
  },
});

export default styles;
