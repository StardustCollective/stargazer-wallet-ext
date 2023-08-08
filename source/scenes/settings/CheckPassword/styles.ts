import { StyleSheet } from 'react-native';
import { NEW_COLORS, COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  inputContainer: {
    marginTop: 32,
    marginBottom: 10,
  },
  input: {
    marginTop: 8,
  },
  recoveryContainer: {
    flex: 1,
    marginTop: 32,
  },
  phraseContainer: {
    marginTop: 8,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  phraseItem: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: NEW_COLORS.indigo_50,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  phraseText: {
    fontWeight: FONT_WEIGHTS.medium,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  dropdownContainer: {
    height: 64,
    marginBottom: 24,
    marginTop: 8,
  },
  doneButton: {
    backgroundColor: NEW_COLORS.primary,
  },
  copyContainer: {
    paddingVertical: 24,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  copyText: {
    color: NEW_COLORS.primary_lighter_1,
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
