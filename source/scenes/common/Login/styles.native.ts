import { StyleSheet } from 'react-native'
import { COLORS } from 'assets/styles/_variables';
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
    marginTop: 56,
    marginBottom: 56,
    width: 192,
    height: 192,
  },
  input: {
    width: '90%',
    marginBottom: 20,
  },
  unlockButton: {
    marginBottom: getDeviceId().includes('iPod') ? 10 : 56,
  },
  recoveryButton: {
    fontSize: getDeviceId().includes('iPod') ? 12 : 16, 
    marginBottom: 10 
  }
});

export default styles;