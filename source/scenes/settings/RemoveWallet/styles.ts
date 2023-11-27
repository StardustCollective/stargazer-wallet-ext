import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    padding: 16,
    marginBottom: 24,
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 64,
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
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
    color: NEW_COLORS.red_700,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: 170,
    marginHorizontal: 6,
  },
  removeButton: {
    backgroundColor: NEW_COLORS.red_700,
  },
});

export default styles;
