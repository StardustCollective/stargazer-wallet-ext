import { StyleSheet } from 'react-native';
import { NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: NEW_COLORS.gray_300,
    marginBottom: 16,
  },
  typeText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});

export default styles;
