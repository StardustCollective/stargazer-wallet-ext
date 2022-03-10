import { StackNavigationOptions } from '@react-navigation/stack';
import { Platform } from 'react-native';

 const config: StackNavigationOptions = {
  headerStyle: {
    height: Platform.OS === 'web' ? '80px' : 110,
    backgroundColor: '#2B1D52',
    borderBottomColor: 'transparent'
  },
  headerTitleStyle: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Rubik',
    color: '#fff',
  },
  headerTitleAlign: 'center',
};

export default config;
