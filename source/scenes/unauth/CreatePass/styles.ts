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
    marginTop: 0,
  },
  errors: {
    marginTop: 0,
  },
  passwordContainer: {
    marginTop: 12,
  },
  warning: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.03,
    width: '100%',
    color: COLORS.gray_100,
  },
  comment: {
    marginTop: 0,
  },
  errorText: {
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.03,
    width: '100%',
    color: COLORS.red,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default styles;
