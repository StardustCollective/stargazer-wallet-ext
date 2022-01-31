import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    width: 125,
    height: 125,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
  },
});

export default styles;
