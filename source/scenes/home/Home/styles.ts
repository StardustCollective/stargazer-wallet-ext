import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

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
    height: 200, // do not use percentages messes up scrollview
    alignItems: 'center',
    justifyContent: 'center',
  },
  fiatBalance: {
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  fiatBalanceLabel: {
    marginHorizontal: 10,
  },
  bitcoinBalance: {
    opacity: 0.5,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default styles;
