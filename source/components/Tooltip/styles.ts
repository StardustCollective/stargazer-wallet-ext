import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOWS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  tooltipContainer: {
    
  },
  tooltip: {
    background: COLORS.gray_dark,
    opacity: 0.95,
    boxShadow: SHADOWS.shadow_tooltip,
    fontFamily: FONTS.quicksand,
    color: COLORS.white,
    borderRadius: 3,
    marginTop: 10,
    padding: '6px 12px',
  },
  
  arrow: {
    color: COLORS.gray_dark,
    width: 14,
    height: 10,
    marginTop: '-10px !important',
  },
});

export default styles;
