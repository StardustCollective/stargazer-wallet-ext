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
    margin: 16,
  },
  amount: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_200,
  },
  currencyIcon: {
    borderRadius: 100,
    width: 32,
    height: 32,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_200,
  },
  detailKey: {
    marginTop: 12,
  },
  detailValue: {
    marginBottom: 12,
  },
  detailRowMaxTotal: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_200,
    flexDirection: 'row',
  },
  detailRowLeft: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  detailRowRight: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 12,
  },
  nextButton: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  supportEmail: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default styles;
