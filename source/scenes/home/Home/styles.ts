import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fiatBalanceContainer: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fiatBalance: {
    maxWidth: '80%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  fiatBalanceLabel: {
    marginHorizontal: 10
  },
  bitcoinBalance: {
    opacity: 0.5,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;