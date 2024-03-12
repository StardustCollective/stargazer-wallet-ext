import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    padding: 16,
    marginBottom: 32,
    flexGrow: 1,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    width: 170,
    marginHorizontal: 6,
  },
});

export default styles;
