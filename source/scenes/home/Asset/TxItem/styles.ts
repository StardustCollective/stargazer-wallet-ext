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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.24)',
  },
  groupBarText: {
    color: 'rgba(0, 0, 0, 0.66)',
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 0,
    marginBottom: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    position: 'relative',
    height: 32,
    width: 32,
    marginRight: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    height: 16,
    width: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
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
