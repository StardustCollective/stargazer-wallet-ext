import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Start from 'containers/unauth/Start';
import Welcome from 'containers/unauth/Welcome';
import Remind from 'containers/unauth/Remind';
import Create from 'containers/unauth/CreateWallet';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Start} exact />
      <Route path="/unauth/welcome" component={Welcome} exact />
      <Route path="/unauth/remind" component={Remind} exact />
      <Route path="/unauth/create" component={Create} exact />
    </Switch>
  );
};

export default UnAuth;
