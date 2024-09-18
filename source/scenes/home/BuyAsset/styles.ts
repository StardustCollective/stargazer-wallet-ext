import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  amountContainer: {
    flex: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountValue: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    marginHorizontal: 8,
  },
  amountMessage: {
    minHeight: 30,
    marginTop: 16,
  },
  providerContainer: {
    flex: 15,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  providerTitle: {
    marginBottom: 12,
  },
  providerCard: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    backgroundColor: COLORS.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
    flex: 1,
  },
  providerCardInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  providerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  providerText: {
    marginLeft: 16,
  },
  numpadContainer: {
    flex: 40,
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flex: 15,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  numPadItem: {
    width: '33.33%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: COLORS.primary_lighter_1,
    marginTop: 16,
    width: 300,
  },
  confirmButtonText: {
    fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.medium,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default styles;
