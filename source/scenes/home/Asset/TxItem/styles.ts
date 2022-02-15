import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  txItem: {
    display: 'flex',
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  groupBar: {
    display: 'flex',
    alignItems: 'center',
    height: 36,
    backgroundColor: COLORS.grey_50,
    color: COLORS.black,
  },
  groupBarSpan: {
    marginLeft: 24,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 24,
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
  recvIcon: {
    transform: 'scaleX(-1)',
  },
  txInfo: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  txInfoLastChild: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'scroll',
    width: 96,
    textAlign: 'right',
    overflow: 'scroll',
  },
  txAmount: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  txAmountText: {
    overflow: 'hidden',
    maxWidth: 100,
  },
  txAmountFiatText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'scroll',
    width: 96,
    overflow: 'scroll',
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
});

export default styles;
