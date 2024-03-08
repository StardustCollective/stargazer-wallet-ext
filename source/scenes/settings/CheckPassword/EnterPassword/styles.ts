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
  button: {
    marginHorizontal: 6,
    width: 170,
  },
});

export default styles;
