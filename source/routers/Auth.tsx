import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Start from 'containers/auth/Start';
import { RootState } from 'reducers/store';
import Home from 'containers/auth/Home';

const Auth = () => {
  const { isLogged } = useSelector((state: RootState) => state.auth);

  return (
    <Switch>
      <Route path="/app.html" component={Start} exact>
        {isLogged && <Redirect to="/home" />}
      </Route>
      <Route path="/home" component={Home} exact />
    </Switch>
  );
};

export default Auth;
