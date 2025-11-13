import { StackNavigationOptions } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import { color } from 'assets/styles/tokens';

const config: StackNavigationOptions = {
  headerStyle: {
    height: Platform.OS === 'web' ? '64px' : scale(90),
    backgroundColor: color.brand_900,
    borderBottomColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#fff',
  },
  headerTitleAlign: 'center',
};

export default config;



