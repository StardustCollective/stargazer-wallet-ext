import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_300,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  historyCell: {
    height: 64,
    flexDirection: 'row',
  },
  historyCellProcessing: {
    backgroundColor: COLORS.yellow_light,
    borderBottomWidth: 1,
    borderColor: COLORS.gray_light_100,
  },
  historyCellSettled: {
    borderBottomWidth: 1,
    borderColor: COLORS.gray_light_100,
    backgroundColor: COLORS.white,
  },
  historyCellLeft: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 16,
    flexDirection: 'row',
  },
  activityIndicator: {
    backgroundColor: COLORS.purple_dark_2,
    borderRadius: 32,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginLeft: 12,
    color: COLORS.orange,
  },
  historyCellRight: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 24,
    flexDirection: 'row',
  },
  amountText: {
    marginRight: 13,
  },
  swapInfo: {
    marginLeft: 12,
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
