import { StyleSheet } from 'react-native';
import { NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  bottomTab: {
    height: 56,
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
    height: 3,
    width: '100%',
    backgroundColor: NEW_COLORS.primary_lighter_2,
    borderRadius: 24,
  },
});

export default styles;
