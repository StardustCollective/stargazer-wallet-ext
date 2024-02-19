import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';
import { getDeviceId } from 'react-native-device-info';

const styles = StyleSheet.create({
  layout: {
    flexGrow: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    marginTop: 48,
    marginBottom: 56,
    width: 192,
    height: 166,
  },
  input: {
    width: '90%',
  },
  unlockButtonContainer: {
    width: '90%',
  },
  unlockButton: {
    marginBottom: getDeviceId().includes('iPod') ? 10 : 56,
    width: '100%',
  },
  recoveryButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    fontSize: getDeviceId().includes('iPod') ? 12 : 16,
  },
  errorContainer: {
    height: 20,
    marginVertical: 2,
  },
  iconContainer: {
    height: '100%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  recoverContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  unlockTitle: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default styles;
