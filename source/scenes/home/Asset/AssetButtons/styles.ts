import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 52,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
    backgroundColor: COLORS.primary_lighter_1,
  },
  label: {
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default styles;
