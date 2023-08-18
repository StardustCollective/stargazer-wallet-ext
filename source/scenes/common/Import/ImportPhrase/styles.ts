import { StyleSheet } from 'react-native';

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
    marginVertical: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  errorLabel: {
    marginTop: 20,
  },
  phraseInputContainer: {
    marginBottom: 8,
  },
});

export default styles;
