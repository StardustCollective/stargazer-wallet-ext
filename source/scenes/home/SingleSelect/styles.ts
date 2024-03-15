import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  selectedBorder: {
    borderColor: '#7C5BF3',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default styles;
