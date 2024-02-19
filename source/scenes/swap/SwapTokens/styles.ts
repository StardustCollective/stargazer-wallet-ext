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
  provider: {
    flexDirection: 'row',
    height: 64,
    marginBottom: 19,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  thirdPartyTextView: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  exolixTextView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 16,
  },
  exolixLogoImage: {
    width: 80,
    height: 32,
  },
  fromInputLabels: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  fromInputSwapFromLabel: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fromInputBalanceLabel: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  fromCurrencyInput: {
    marginBottom: 16,
  },
  fromCurrencyInputError: {
    marginBottom: 16,
    borderColor: COLORS.red,
  },
  toInputLabels: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  toInputSwapLabel: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  toBlank: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  toCurrencyInput: {
    marginBottom: 24,
  },
  toInputSwapFromLabel: {
    flex: 1,
  },
  swapIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rate: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray_200,
  },
  rateLabel: {
    flex: 1,
  },
  rateValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  minimumAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray_200,
  },
  minimumAmountLabel: {
    flex: 1,
  },
  minimumAmountValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  nextButton: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
