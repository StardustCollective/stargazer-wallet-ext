import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    margin: 16,
  },
  loadingContainer: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default styles;
