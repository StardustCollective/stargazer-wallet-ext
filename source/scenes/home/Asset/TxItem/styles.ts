import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  txItem: {
    display: 'flex',
    backgroundColor: COLORS.white,
    // flex: 1,
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
  },
  groupBarText: {
    marginLeft: 24,
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
    marginVertical: 16,
    marginHorizontal: 24,
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
    display: 'flex',
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfoWrapper: {
    display: 'flex',
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txAddress: {
    maxWidth: 96,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black,
  },
  txAmountWrapper: {
    display: 'flex',
    right: 0,
    height: 48,
    flexDirection: 'column',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  txAmountText: {
    color: COLORS.black,
    maxWidth: 100,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  txAmountFiatText: {
    width: 96,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20,
    textAlign: 'right',
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
