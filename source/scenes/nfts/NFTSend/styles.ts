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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
