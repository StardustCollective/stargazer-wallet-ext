import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  fullselect: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    height: 60,
    transition: 'all 300ms',
  },
  selected: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetLogo: {
    marginRight: 8,
  },
  labelText: {
    marginBottom: 0,
    marginTop: 0,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
  },
  address: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 60,
  },
  addressActive: {
    color: COLORS.gray_light,
  },
  addressText: {
    color: 'rgba(255, 255, 255, 0.66)',
    marginLeft: 0,
    marginBottom: 0,
  },
  options: {
    margin: 0,
    padding: 0,
    transition: 'all 300ms',
    transformOrigin: 'top',
    position: 'absolute',
    width: '100%',
    top: 60,
    background: 'rgba($white, 0.8)',
    backdropFilter: 'blur(10)',
    borderBottomColor: COLORS.gray_dark,
    borderWidth: 1,
    overflow: 'scroll',
    maxHeight: 468,
    zIndex: 10,
  },
});

export default styles;
