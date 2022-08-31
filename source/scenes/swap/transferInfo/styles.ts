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
  dataRow: {},
  dataValue: {
    width: '100%',
    height: 48,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: COLORS.gray_300,
    backgroundColor: COLORS.gray_400,
  },
  trasnsactionFee: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  dataValueText:{
    marginHorizontal: 16,
  },
  transactionFeeInput: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  transactionFeeTextField: {
    flex: 1,
    fontSize: 16,
  },
  transactionFeeRecommend: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  nextButton: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  }
});

export default styles;
