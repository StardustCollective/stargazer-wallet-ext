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
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    backgroundColor: '#5b36d3',
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1.5,
  },
  label: {
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default styles;
