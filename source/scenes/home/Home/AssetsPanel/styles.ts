import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  activity: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  content: {
    overflow: 'scroll',
    margin: 16,
  }

});

export default styles;
