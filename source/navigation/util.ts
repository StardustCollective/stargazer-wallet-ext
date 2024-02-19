///////////////////////////
// Imports
///////////////////////////

import { StackActions } from '@react-navigation/native';

///////////////////////////
// Utils Functions
///////////////////////////

const popToTop = (navigation: any) => {
  navigation.dispatch(StackActions.popToTop());
};

const replace = (navigation: any, route: string) => {
  navigation.dispatch(StackActions.replace(route));
};

///////////////////////////
// Exports
///////////////////////////

export default {
  popToTop,
  replace,
};
