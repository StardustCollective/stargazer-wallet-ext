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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 129,
    marginHorizontal: 10,
  },
  tokenSwapText: {
    marginTop: 41,
    textAlign: 'center',
  },
  statusText: {
    marginTop: 12,
    textAlign: 'center',
  },
  buttons: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  viewHistoryButton: {
    marginBottom: 20,
  },
});

export default styles;
