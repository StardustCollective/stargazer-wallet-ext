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
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.24)',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    justifyContent: 'center',
    marginRight: 16,
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
