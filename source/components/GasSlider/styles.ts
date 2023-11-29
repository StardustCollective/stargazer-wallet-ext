import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  gasPriceContainer: {
    width: '100%',
    marginTop: 8,
    height: 120,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    borderRadius: 6,
  },
  gasPriceHeader: {
    flex: 1,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  gasPriceHeaderLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  gasPriceHeaderRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gasSpeedBox: {
    flexDirection: 'row',
    height: 35,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    borderRadius: 20,
    alignItems: 'center',
  },
  gasSpeedBoxRight: {
    marginRight: 15,
  },
  gasSpeedBoxLeft: {
    marginLeft: 15,
    marginRight: 8,
  },
  gasPriceFooter: {
    flex: 1,
  },
  gasEstimateLabel: {
    marginTop: 16,
  },
});

export default styles;
