import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'containers/Home';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Home} exact />
    </Switch>
  );
};

export default UnAuth;
