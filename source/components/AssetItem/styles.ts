import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  assetIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray_100,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  dagIcon: {
    width: 20,
    height: 25,
  },
  imageNFTIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  componentIcon: {
    width: 20,
    height: 20,
  },
  assetBalance: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assetName: {
    width: '50%',
    justifyContent: 'center',
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
