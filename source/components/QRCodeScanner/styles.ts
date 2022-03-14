import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  qrCodeHeader: {
    flexDirection: 'row',
    marginTop: '12%',
    justifyContent: 'space-evenly',
    alignItems: 'center'
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
    backgrounColor: 'orange',
  },
  qrSectionCenter: {
    flex: 1,

    backgrounColor: 'orange',
  },
  qrSectionRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  qrCodeIcon: {
    marginRight: 20,
  },
})

export default styles;