import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  title: {
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 0,
  },
  checkGreenContainer: {
    marginRight: 4,
  },
  quantityLabelContainer: {
    marginHorizontal: -10,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityTitle: {
    fontWeight: FONT_WEIGHTS.medium,
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDivider: {
    width: 1,
    height: 24,
    backgroundColor: NEW_COLORS.gray_300,
  },
  qrCodeButton: {
    height: '100%',
    justifyContent: 'center',
    width: 40,
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 10,
    paddingTop: 4,
  },
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
    flex: 1,
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
  sliderContainer: {},
  gasEstimateLabel: {
    marginTop: 16,
  },
  gasLoadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
