import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  label: {
    marginTop: 0,
  },
  warningContainer: {
    padding: 16,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDB022',
    backgroundColor: '#FFFCF5',
    flexDirection: 'row',
  },
  warningIcon: {
    marginTop: 4,
  },
  warningText: {
    marginLeft: 16,
    marginRight: 24,
  },
  qrCodeContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
    alignSelf: 'center',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 10,
    paddingTop: 4,
  },
});

export default styles;
