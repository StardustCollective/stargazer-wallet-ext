import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  swapInput: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
  },
  swapInputLeftBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  swapInputRightBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  swapInputTextInput: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 20,
    color: COLORS.black,
  },
  swapInputChevron: {
    marginRight: 16,
  },
  swapInputTickerText: {
    marginRight: 17,
    marginLeft: 17,
  },
  currencyIcon: {
    borderRadius: 100,
    width: 30,
    height: 30,
    overflow: 'hidden',
  },
});

export default styles;
