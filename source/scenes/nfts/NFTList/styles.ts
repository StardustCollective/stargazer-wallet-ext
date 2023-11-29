import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables.native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFoundText: {
    fontSize: 16,
    marginTop: 16,
    color: '#000000A8',
  },
  columnWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingVertical: 8,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    backgroundColor: COLORS.white,
  },
  searchInput: {
    color: 'black',
  },
});

export default styles;
