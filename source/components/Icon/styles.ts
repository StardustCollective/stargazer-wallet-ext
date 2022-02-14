import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  iconWrapper: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.gray_light,
    color: COLORS.primary,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaced: {
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
});

export default styles;
