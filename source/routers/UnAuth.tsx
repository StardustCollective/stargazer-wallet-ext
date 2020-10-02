import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Starter from 'containers/unauth/Starter';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Starter} exact />
    </Switch>
  );
};

export default UnAuth;
