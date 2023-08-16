import { StyleSheet } from 'react-native';
import { NEW_COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEW_COLORS.warning_border,
    backgroundColor: NEW_COLORS.warning_background,
  },
  warningIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    color: NEW_COLORS.warning_text,
  },
});

export default styles;
