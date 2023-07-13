import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray_100,
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  dagIcon: { 
    width: 20,
    height: 23,
  },
  toggleContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  assetInfo: {
    width: '60%',
    justifyContent: 'center',
    marginLeft: 12,
  },
  symbolLabel: {
    fontWeight: FONT_WEIGHTS.semibold,
  }
});

export default styles;
