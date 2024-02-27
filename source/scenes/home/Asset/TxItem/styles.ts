import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  txItem: {
    display: 'flex',
    backgroundColor: COLORS.white,
    flexDirection: 'column',
    width: '100%',
  },
  groupBar: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 36,
    backgroundColor: COLORS.grey_50,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey_100,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_100,
  },
  groupBarText: {
    marginLeft: 16,
    color: '#575757',
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 0,
    marginBottom: 0,
  },
  groupBarSpan: {
    marginLeft: 24,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  txIcon: {
    display: 'flex',
    color: COLORS.gray_100,
    alignItems: 'center',
  },
  iconCircle: {
    marginRight: 12,
    width: 38,
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    height: 32,
    width: 38,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  logo: {
    height: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 8,
    width: 16,
  },
  txInfoWrapper: {
    display: 'flex',
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txAddress: {
    color: '#575757',
  },
  txAmountWrapper: {
    display: 'flex',
    right: 0,
    height: 40,
    flexDirection: 'column',
    textAlign: 'right',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  txAmountFiatText: {
    color: '#575757',
  },
  txExplorerIcon: {
    width: 60,
    display: 'flex',
    color: COLORS.gray_dark,
    transition: 'all 0.3s',
  },
  circle: {
    display: 'flex',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  icon: {
    fontSize: 16,
  },
  gasSettings: {
    position: 'relative',
  },
});

export default styles;
