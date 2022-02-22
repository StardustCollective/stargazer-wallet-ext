import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  linkIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 24,
    padding: 0,
    width: 32,
    height: 32,
    background: COLORS.gray_100,
    transition: 'all 0.3s',
  },
  active: {
    backgroundColor: COLORS.gray_light,
  },
  svg: {
    color: COLORS.gray,
  },
});

export default styles;
