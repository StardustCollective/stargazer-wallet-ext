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
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.gray_100,
  },
  imageIcon: {
    width: 22,
    height: 22,
  },
  dagIcon: { 
    width: 22,
    height: 27,
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
