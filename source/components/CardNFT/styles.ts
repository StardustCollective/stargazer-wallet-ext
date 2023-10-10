import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: COLORS.white,
  },
  networkContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 163, 175, 0.66)',
  },
  imageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: NEW_COLORS.gray_300,
  },
  image: {
    height: 148,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  textContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 4,
  },
  itemsContainer: {
    flexDirection: 'row',
  },
  subtitle: {
    marginRight: 4,
    fontWeight: '500',
  },
});

export default styles;
