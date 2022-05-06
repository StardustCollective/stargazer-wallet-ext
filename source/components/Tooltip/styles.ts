import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tooltip: {
    color: COLORS.white,
    borderRadius: 3,
    fontSize: 12,
    paddingRight: 12,
    paddingLeft: 12,
  },
});

export default styles;
