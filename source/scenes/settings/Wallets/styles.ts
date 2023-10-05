import { StyleSheet } from 'react-native';
import { COLORS, FONTS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wallets: {
    flex: 1,
  },
  walletsContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
    letterSpacing: 0.08,
    color: NEW_COLORS.secondary_text,
    fontFamily: FONTS.inter,
  },
  groupWalletWrapper: {
    marginBottom: 20,
  },
  walletWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 16,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: NEW_COLORS.gray_300,
  },
  text: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.inter,
    color: COLORS.black,
  },
  walletLabel: {},
  textSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: NEW_COLORS.secondary_text,
    overflow: 'hidden',
    fontFamily: FONTS.inter,
    opacity: 0.88,
  },
  stargazerIconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetIconWrapperDAG: {
    backgroundColor: COLORS.gray_light_100,
  },
  assetIconWrapperETH: {
    backgroundColor: COLORS.gray_light_100,
  },
  assetIcon: {
    height: 24,
    width: 24,
  },
  firstChild: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastChild: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1,
  },
  walletInfoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabelContainer: {
    justifyContent: 'flex-end',
  },
  rightArrow: {
    marginRight: 6,
  },
});

export default styles;
