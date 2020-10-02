import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Starter from 'containers/unauth/Starter';
import WalletLoader from 'containers/unauth/WalletLoader';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Starter} exact />
      <Route path="/wallet" component={WalletLoader} exact />
    </Switch>
  );
};

export default UnAuth;
