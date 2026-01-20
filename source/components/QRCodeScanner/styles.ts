import { StyleSheet } from 'react-native';
import { color } from 'assets/styles/tokens';
import { iosPlatform } from 'utils/platform';

const styles = StyleSheet.create({
  qrCodeHeader: {
    flexDirection: 'row',
    marginTop: iosPlatform() ? '12%' : '5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  qrCameraTopContent: {
    flex: 1,
    backgroundColor: color.brand_900,
  },
  qrCameraBottomContent: {
    flex: 1,
    backgroundColor: color.brand_900,
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
  cameraContainer: {
    flex: 2,
  },
  camera: {
    position: 'relative',
    height: '100%',
    width: '100%',
  }
});

export default styles;
