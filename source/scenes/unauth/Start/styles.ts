import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';
import { getDeviceId } from 'react-native-device-info';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: 56,
    marginBottom: 56,
    width: 192,
    height: 192,
  },
  started: {
    marginBottom: getDeviceId().includes('iPod') ? 30 : 56,
  },
});

export default styles;
