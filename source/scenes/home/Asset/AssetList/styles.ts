import { StyleSheet } from 'react-native';
import { color } from 'assets/styles/tokens';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    margin: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: color.brand_900
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 16,
    marginTop: 8,
  },
});

export default styles;
