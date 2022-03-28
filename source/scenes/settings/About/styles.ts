import { StyleSheet } from 'react-native';

import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  about: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  text: {
    marginBottom: 24,
    color: COLORS.gray_dark,
    fontWeight: '500',
    fontSize: 12,
  },
  link: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  termsAndPrivacy: {
    marginBottom: 12,
  },
  privacy: {
    marginTop: 24,
  },
});

export default styles;
