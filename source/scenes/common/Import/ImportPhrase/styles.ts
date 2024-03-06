import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    flexGrow: 1,
    minHeight: '90%',
    marginHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  buttonContainer: {
    marginVertical: 40,
    alignSelf: 'center',
  },
  dropdownContainer: {
    height: 60,
    marginTop: 20,
    zIndex: 2,
  },
  itemContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    width: 358,
  },
  modalButton: {
    marginTop: 12,
  },
  errorLabel: {
    marginTop: 20,
  },
  phraseInputContainer: {
    marginBottom: 8,
  },
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
  },
  checkboxTextContainer: {
    flex: 1,
    marginTop: -2,
  },
  checkboxText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default styles;
