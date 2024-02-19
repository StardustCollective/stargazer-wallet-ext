import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_300,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    margin: 16,
  },
  dataRow: {},
  dataValue: {
    width: '100%',
    height: 48,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: COLORS.gray_300,
    backgroundColor: COLORS.gray_400,
  },
  trasnsactionFee: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  dataValueText: {
    marginHorizontal: 16,
  },
  transactionFeeInput: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  transactionFeeTextField: {
    flex: 1,
    fontSize: 16,
  },
  transactionFeeRecommend: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  nextButton: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  gasPriceContainer: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_light_200,
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
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gasSpeedBox: {
    flexDirection: 'row',
    height: 35,
    borderWidth: 1,
    borderColor: COLORS.gray_300,
    borderRadius: 8,
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
  sliderContainer: {
    marginHorizontal: 30,
  },
  gasEstimateLabel: {
    marginTop: 16,
  },
  gasLoadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
