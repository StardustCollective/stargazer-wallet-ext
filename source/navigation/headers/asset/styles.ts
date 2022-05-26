import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  linkIcon: {
    marginRight: scale(10),
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
