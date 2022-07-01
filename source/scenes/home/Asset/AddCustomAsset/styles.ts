import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginTop: 6,
  },
  warningContainer: {
    padding: 16,
    marginTop: 24,
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
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 10,
    paddingTop: 6,
  }
});

export default styles;
