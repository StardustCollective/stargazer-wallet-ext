import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

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
    paddingLeft: 12,
  },
  boxMedium: {
    height: 18,
    width: 100,
    borderRadius: 2,
  },
  boxSmall: {
    height: 14,
    width: 60,
    borderRadius: 2,
  },
  circle: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  divider: {
    height: 4,
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
  iconContainer: {
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfoWrapper: {
    display: 'flex',
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
});

export default styles;
