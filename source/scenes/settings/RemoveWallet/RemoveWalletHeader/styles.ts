import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 40,
  },
  walletContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconComponent: {
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    backgroundColor: COLORS.white,
  },
  icon: {
    width: 38,
    height: 38,
  },
  walletLabel: {
    marginTop: 12,
  },
  title: {
    marginBottom: 12,
    color: NEW_COLORS.red_700,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default styles;
