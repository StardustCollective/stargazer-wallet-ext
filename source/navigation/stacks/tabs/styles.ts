import { StyleSheet } from 'react-native';
import { color } from 'assets/styles/tokens';

const styles = StyleSheet.create({
  bottomTab: {
    borderTopWidth: 1,
    borderTopColor: color.gray_100,
  },
  bottomTabHeight: {
    height: 64,
  },
  tabItemContainer: {
    height: '100%',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActiveItemLine: {
    position: 'absolute',
    top: 0,
    height: 4,
    width: '100%',
    backgroundColor: color.brand_400,
  },
});

export default styles;
