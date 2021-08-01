import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
// import {
//   Switch,
//   Route,
//   Redirect,
//   useLocation,
//   useHistory,
// } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';


// import Receive from 'containers/auth/Receive';

import { useController } from 'hooks/index';
import { SendMatchProps } from '../types';


///////////////////////////
// Screens
///////////////////////////

import Start from 'containers/auth/Start';
import Home from 'containers/auth/Home';
import Asset from 'containers/auth/Asset';
import Send, { SendConfirm } from 'containers/auth/Send';
import GasSettings from 'containers/auth/Send/GasSettings';
import AddAsset from 'containers/auth/Asset/AddAsset';
import Import from 'containers/common/Import';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
// import { useController } from 'hooks/index';

///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();

const Auth = () => {

  const controller = useController();
  const isUnlocked = controller.wallet.isUnlocked();
  // const location = useLocation();
  // const alert = useAlert();
  // const history = useHistory();

  // const transitions = useTransition(location, (locat) => locat.pathname, {
  //   initial: { opacity: 1 },
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   config: { duration: 500 },
  // });

  // useEffect(() => {
  //   const redirectRoute = controller.appRoute();
  //   if (
  //     redirectRoute === '/send/confirm' &&
  //     !controller.wallet.account.getTempTx()
  //   ) {
  //     history.push('/home');
  //     return;
  //   }
  //   if (redirectRoute !== '/app.html') history.push(redirectRoute);
  // }, []);

  // useEffect(() => {
  //   alert.removeAll();
  //   controller.appRoute(location.pathname);
  // }, [location]);

  // TODO: Migration Notes
  // - If the App is unlocked (Authorized) it should navigate to the home screen


  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, headerShown: false }} initialRouteName={isUnlocked ? screens.authorized.home : screens.authorized.start}>
      <Stack.Screen options={{ headerShown: false }} name={screens.authorized.start} component={Start} />
      {!isUnlocked && <Stack.Screen name={screens.authorized.start} component={Start} />}
      {isUnlocked && <Stack.Screen name={screens.common.import} component={Import} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.home} component={Home} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.addAsset} component={AddAsset} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.asset} component={Asset} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.sendConfirm} component={SendConfirm} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.send} component={Send} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.gasSettings} component={GasSettings} />}
      {/* <Route path="/app.html" component={Start} exact>
              {isUnlocked && <Redirect to="/home" />}
            </Route>
            {!isUnlocked && <Route path="/import" component={Import} exact />}
            {isUnlocked && <Route path="/home" component={Home} exact />}
            {isUnlocked && (
              <Route path="/asset/add" component={AddAsset} exact />
            )}
            {isUnlocked && <Route path="/asset" component={Asset} exact />}
            {isUnlocked && (
              <Route path="/send/confirm" component={SendConfirm} exact />
            )}
            {isUnlocked && <Route path="/send" component={Send} exact />}
            {isUnlocked && (
              <Route path="/gas-settings" component={GasSettings} exact />
            )}
            {isUnlocked && (
              <Route
                path="/send/:address"
                render={({ match }: SendMatchProps) => (
                  <Send initAddress={match.params.address} />
                )}
                exact
              />
            )} */}
      {/* {isUnlocked && <Route path="/receive" component={Receive} exact />} */}
    </Stack.Navigator>
  );
};

export default Auth;
