import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.gray_light,
  },
  content: {
    margin: 16,
    paddingBottom: 18,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  titleContainer: {
    marginLeft: 8,
  },
});

export default styles;
