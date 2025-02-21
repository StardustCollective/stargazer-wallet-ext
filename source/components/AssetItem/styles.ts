import { StyleSheet } from 'react-native';
import { NEW_COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  assetIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  balanceText: {
    textAlign: 'right',
  },
  assetBalance: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  networkLogo: {
    position: 'absolute',
    backgroundColor: 'white',
    right: -4,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  assetName: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
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
    paddingLeft: 6,
  },
  red: {
    color: NEW_COLORS.red_100,
    paddingLeft: 6,
  },
});

export default styles;
