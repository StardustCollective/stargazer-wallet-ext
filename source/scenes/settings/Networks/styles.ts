import { StyleSheet } from 'react-native';

import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray_dark,
  },
  containerBase: {
    marginBottom: 8,
  }
});

export default styles;
