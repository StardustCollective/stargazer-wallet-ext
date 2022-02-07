import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({

  activity: {
    minHeight: '60%',
    width: "100%",
    backgroundColor: COLORS.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  content: {
    margin: 16,
  }

});

export default styles;
