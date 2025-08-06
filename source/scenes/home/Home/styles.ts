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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
    marginHorizontal: 32,
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginHorizontal: 12,
  },
  button: {
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 48,
    minWidth: 150,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',

    shadowColor: 'rgba(16, 24, 40, 0.12)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonLabel: {
    lineHeight: 24,
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
