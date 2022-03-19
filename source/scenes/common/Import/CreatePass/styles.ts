import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
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
  passwordContainer: {
    marginTop: 12,
  },
  warning: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.03,
    marginTop: 12,
    width: '100%',
    color: COLORS.gray_100,
  },
  errorText: {
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.03,
    width: '100%',
    marginTop: 12,
    color: COLORS.red,
  },
  comment: {
    marginTop: 0,
  },
  errors: {
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
  },
});

export default styles;
