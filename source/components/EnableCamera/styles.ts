import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';
import { androidPlatform } from 'utils/platform';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...(androidPlatform() ? { height: '100%' } : {}),
    paddingHorizontal: '20%',
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginTop: 12,
  },
  bodyText: {
    marginTop: 12,
    marginBottom: 48,
  },
});

export default styles;
