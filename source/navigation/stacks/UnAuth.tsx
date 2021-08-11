///////////////////////////
// Modules
///////////////////////////

import React from 'react';
// import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

///////////////////////////
// Screens
///////////////////////////

import Start from 'containers/unauth/Start';
import Remind from 'containers/unauth/Remind';
import CreatePass from 'containers/unauth/CreatePass';
import {
  CreatePhrase,
  ConfirmPhrase,
  RemindPhrase,
} from 'containers/unauth/Phrase';
import Import from 'containers/common/Import';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import { useController } from 'hooks/index';

///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();

///////////////////////////
// Stack Component
///////////////////////////

const UnAuth = () => {
  // const location = useLocation();
  // const history = useHistory();
  // const controller = useController();
  // const transitions = useTransition(location, (locat) => locat.pathname, {
  //   initial: { opacity: 1 },
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   config: { duration: 500 },
  // });

  // useEffect(() => {
  //   const redirectRoute = controller.appRoute();
  //   history.push(redirectRoute);
  // }, []);

  // useEffect(() => {
  //   controller.appRoute(location.pathname);
  // }, [location]);

  /**
   * --- Create Account Flow ---
   * Start => Remind => CreatePass => RemindPhrase => CreatePhrase => ConfirmPhrase
   */

  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, headerShown: false }} initialRouteName={screens.unAuthorized.home}>
      <Stack.Screen options={{ headerShown: false }} name={screens.unAuthorized.home} component={Start} />
      <Stack.Screen name={screens.common.import} component={Import} />
      <Stack.Screen name={screens.unAuthorized.remind} component={Remind} />
      <Stack.Screen name={screens.unAuthorized.createPass} component={CreatePass} />
      <Stack.Screen name={screens.unAuthorized.createPhraseRemind} component={RemindPhrase} />
      <Stack.Screen name={screens.unAuthorized.createPhraseGenerated} component={CreatePhrase} />
      <Stack.Screen  name={screens.unAuthorized.createPhraseCheck} component={ConfirmPhrase} />
      {/* <Route path="/import" component={Import} exact />
      <Route path="/remind" component={Remind} exact />
      <Route path="/create/pass" component={CreatePass} exact />
      <Route
        path="/create/phrase/remind"
        component={RemindPhrase}
        exact
      />
      <Route
        path="/create/phrase/generated"
        component={CreatePhrase}
        exact
      />
      <Route
        path="/create/phrase/check"
        component={ConfirmPhrase}
        exact
      /> */}
    </Stack.Navigator>
  );
};

export default UnAuth;
