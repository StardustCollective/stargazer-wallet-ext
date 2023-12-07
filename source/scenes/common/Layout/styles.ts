import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heading: {
    backgroundColor: COLORS.grey_light,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    marginTop: 25,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

export default styles;
