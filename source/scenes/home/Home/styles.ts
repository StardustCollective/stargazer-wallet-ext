import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  fiatBalanceContainer: {
    width: '100%',
    // height: 193, // do not use percentages messes up scrollview
    alignItems: 'center',
    paddingTop: 24,
  },
  fiatBalance: {
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  fiatBalanceLabel: {
    marginHorizontal: 8,
  },
  fiatType: {
    fontSize: 20,
    lineHeight: 28,
  },
  bitcoinBalance: {
    opacity: 0.66,
    marginTop: 8,
  },
  balanceText: {
    fontSize: 16,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons:{
    flex: 1, 
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonNormal: {
    marginVertical: 32,
  },
});

export default styles;
