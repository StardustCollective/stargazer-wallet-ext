import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  listContainer: {
    position: 'absolute',
    top: 66,
    left: -1,
    right: -1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    height: 40,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default styles;
