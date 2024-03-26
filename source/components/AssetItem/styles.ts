import { StyleSheet } from 'react-native';
import { NEW_COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  assetIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  balanceText: {
    textAlign: 'right',
  },
  assetBalance: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assetName: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  assetPrice: {
    flexDirection: 'row',
  },
  balanceContainer: {
    flexDirection: 'column',
  },
  assetPriceRight: {
    alignItems: 'flex-end',
  },
  green: {
    color: NEW_COLORS.green_100,
    paddingLeft: 8,
  },
  red: {
    color: NEW_COLORS.red_100,
    paddingLeft: 8,
  },
});

export default styles;
