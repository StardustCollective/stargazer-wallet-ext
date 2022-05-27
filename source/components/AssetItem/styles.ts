import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  assetIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gray_100,
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
  dagIcon: {
    width: 30,
    height: 35,
  },
  imageNFTIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  componentIcon: {
    width: 40,
    height: 40,
  },
  assetBalance: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assetName: {
    marginLeft: 16,
  },
  assetPrice: {
    flexDirection: 'row',
  },
  green: {
    color: COLORS.green,
    paddingLeft: 10,
  },
  red: {
    color: COLORS.red,
    paddingLeft: 10,
  },
});

export default styles;
