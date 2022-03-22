import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginBottom: 0,
  },
  content: {
    margin: 16,
    marginBottom: 8,
  },
});

export default styles;
