import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wallets: {
    flex: 1,
    backgroundColor: COLORS.gray_light_100,
  },
  walletsContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    fontFamily: FONTS.rubik,
  },
  groupWalletWrapper: {},
  walletWrapper: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 70,
    paddingLeft: 24,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray_light,
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.rubik,
    color: COLORS.gray_dark,
  },
  walletLabel: {},
  groupText: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 20,
    fontFamily: FONTS.rubik,
  },
  textSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray_100,
    overflow: 'hidden',
    fontFamily: FONTS.rubik,
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
  },
  stargazerIconWrapper: {
    backgroundColor: COLORS.primary,
    marginRight: 12,
    borderRadius: 18,
    height: 36,
    width: 36,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetIconWrapperDAG: {
    backgroundColor: COLORS.white,
  },
  assetIconWrapperETH: {
    backgroundColor: COLORS.gray_light_100,
  },
  assetIcon: {
    height: 24,
    width: 24,
  },
  icon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  iconCheckWrapper: {
    position: 'absolute',
    left: 44,
    top: 10,
    height: 16,
    width: 16,
    marginRight: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  iconCheckContainer: {
    marginRight: 0,
    height: 16,
    width: 16,
  },
  iconCheck: {
    fontSize: 16,
    color: COLORS.accent_1,
    backgroundColor: COLORS.white,
    borderRadius: 80,
  },
  infoIconWrapper: {
    color: 'white',
    padding: 0,
  },
  infoIcon: {
    size: 20,
    color: COLORS.white,
    backgroundColor: COLORS.gray_100,
    borderRadius: 80,
  },
  infoIconButton: {},
  firstChild: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  lastChild: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottom: 0,
  },
  details: {
    width: 32,
    height: 32,
    color: COLORS.gray_100,
  },
  walletInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabelContainer: {
    justifyContent: 'flex-end',
  },
  walletInfoIcon: {
    flex: 1,
  },
});

export default styles;
