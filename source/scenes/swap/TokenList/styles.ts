import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_300,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    margin: 16,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    backgroundColor: COLORS.primary,
  },
  search: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  searchIcon: {
    marginLeft: 16,
  },
  searchInput: {
    marginLeft: 12,
    color: COLORS.white,
  },
  tokenCell: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.gray_600,
  },
  tokenIconContainer: {
    position: 'relative',
  },
  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  networkIcon: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    bottom: 0,
    right: -4,
  },
  tokenCellLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginLeft: 12,
  },
  tokenCellLeftContent: {
    marginLeft: 16,
  },
  tokenCellRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 12,
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
