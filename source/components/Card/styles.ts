import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 8,
    background: COLORS.white,
    margin: 0,
    marginBottom: 10,
  },
  wrapperStyle: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default styles;
