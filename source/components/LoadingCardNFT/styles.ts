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
  image: {
    height: 148,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomWidth: 1,
    borderBottomColor: NEW_COLORS.gray_300,
  },
  textContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  title: {
    height: 20,
  },
  subtitle: {
    height: 20,
    width: 60,
    marginTop: 4,
  },
});

export default styles;
