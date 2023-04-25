import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    height: 120,
    backgroundColor: 'red',
  },
  content: {
    flex: 1,
    backgroundColor: 'pink',
  }
});

export default styles;
