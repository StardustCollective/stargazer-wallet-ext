import { StyleSheet } from 'react-native';

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
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  buttonContainer: {
    width: '50%',
  },
  cancel: {
    marginRight: 6,
  },
  primary: {
    marginLeft: 6,
  },
});

export default styles;
