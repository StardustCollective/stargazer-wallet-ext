import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

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
    marginRight: 5,
  },
  logoHeader: {
    marginBottom: 0,
    marginTop: 0,
    lineHeight: 24,
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.white,
  },
  address: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  addressActive: {
    color: COLORS.gray_light,
  },
  addressText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: FONT_WEIGHTS.regular,
    // fontFamily: FONTS.quicksand,
    color: COLORS.white,
    marginTop: 2,
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
