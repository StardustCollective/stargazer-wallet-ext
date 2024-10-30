import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

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
    marginTop: 24,
    // height: 193, // do not use percentages messes up scrollview
    alignItems: 'center',
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 32,
  },
  buttonNormal: {
    marginBottom: 32,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginRight: 12,
  },
});

export default styles;
