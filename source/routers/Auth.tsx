import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Starter from 'containers/auth/Starter';

const Auth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Starter} exact />
    </Switch>
  );
};

export default Auth;
