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
  searchContainer: {
    padding: 16,
  },
  noFoundText: {
    fontSize: 16,
    marginTop: 16,
    color: '#000000A8',
  },
  searchInputContainer: {
    backgroundColor: COLORS.white,
  },
  searchInput: {
    color: 'black',
  },
  columnWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingVertical: 8,
  },
});

export default styles;
