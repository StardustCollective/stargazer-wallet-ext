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
    marginRight: 16,
    marginLeft: 16,
  },
  currencyIconContainer: {
    position: 'relative',
  },
  currencyIcon: {
    borderRadius: 16,
    width: 32,
    height: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  networkIcon: {
    position: 'absolute',
    borderRadius: 8,
    width: 16,
    height: 16,
    overflow: 'hidden',
    right: -4,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
});

export default styles;
