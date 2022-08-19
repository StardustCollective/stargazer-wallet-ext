import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wallets: {
    width: '100%',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    height: 468,
    paddingBottom: 24,
    overflow: 'scroll',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    fontFamily: FONTS.inter,
  },
  groupWallet: {
    display: 'flex',
    paddingVertical: 0,
    paddingHorizontal: 12,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.gray_light,
    borderWidth: 1,
    position: 'relative',
  },
  groupText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.inter,
    color: COLORS.gray_dark,
  },
  iconContainer: {
    display: 'flex',
    backgroundColor: 'orange',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray_light,
    paddingLeft: 10,
  },
  iconText: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    marginRight: 10,
  },
  iconFirst: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  iconLast: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomWidth: 0,
  },
  details: {
    width: 32,
    height: 32,
    color: COLORS.gray_100,
  },
  noSitesConnected: {
    backgroundColor: COLORS.white,
    display: 'flex',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default styles;
