import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Starter from 'containers/unauth/Starter';
import WelcomeWallet from 'containers/unauth/Welcome';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Starter} exact />
      <Route path="/unauth/welcome" component={WelcomeWallet} exact />
    </Switch>
  );
};

export default UnAuth;
