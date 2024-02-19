import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';
import { iosPlatform } from 'utils/platform';

const styles = StyleSheet.create({
  qrCodeHeader: {
    flexDirection: 'row',
    marginTop: iosPlatform() ? '12%' : '5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  qrCameraTopContent: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  qrCameraBottomContent: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  qrSectionLeft: {
    flex: 1,
  },
  qrSectionCenter: {
    flex: 1,
  },
  qrSectionRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  qrCodeIcon: {
    marginRight: 20,
  },
});

export default styles;
