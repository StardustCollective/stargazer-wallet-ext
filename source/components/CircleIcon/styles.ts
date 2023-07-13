import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  logoWrapper: {
    height: 32,
    width: 32,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.gray_light,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
