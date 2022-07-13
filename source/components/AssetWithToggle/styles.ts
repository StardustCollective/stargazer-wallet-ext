import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  cardContainer: {
    height: 36,
  },
  assetIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray_100,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  dagIcon: { 
    width: 20,
    height: 25,
  },
  toggleContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  assetInfo: {
    width: '60%',
    marginLeft: 16,
  },
});

export default styles;
