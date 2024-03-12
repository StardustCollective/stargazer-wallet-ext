import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// The NavigationProp type should be used as a "general" type for the
// navigation object when there're no params needed for a screen.

export type NavigationProp = NativeStackNavigationProp<any, any>;
