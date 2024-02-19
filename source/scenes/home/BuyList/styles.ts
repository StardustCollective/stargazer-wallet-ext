import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    margin: 16,
  },
  loadingContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
