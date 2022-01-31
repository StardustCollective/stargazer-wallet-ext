import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  checkIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  savePasswordWarning: {
    marginTop: 10,
  },
  errors: {
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});

export default styles;
