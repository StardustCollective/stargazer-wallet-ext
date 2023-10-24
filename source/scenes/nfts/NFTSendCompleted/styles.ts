import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  textContainer: {
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 48,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  viewTxButton: {
    marginBottom: 16,
  },
  viewTxTitle: {
    marginRight: 8,
  },
});

export default styles;
