import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 40,
    alignItems: 'flex-end',
  },
  containerSelected: {
    backgroundColor: '#4C2FB11F',
  },
  iconContainer: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  listContainer: {
    position: 'absolute',
    minWidth: 200,
    top: 28,
    backgroundColor: 'white',
    right: 0,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemContainer: {
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemIconContainer: {
    marginRight: 8,
  },
});

export default styles;
