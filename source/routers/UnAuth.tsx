import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Start from 'containers/unauth/Start';
import Remind from 'containers/unauth/Remind';
import CreatePass from 'containers/unauth/CreatePass';
import CreatePhrase from 'containers/unauth/Phrase';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Start} exact />
      <Route path="/unauth/remind" component={Remind} exact />
      <Route path="/unauth/create/pass" component={CreatePass} exact />
      <Route path="/unauth/create/phrase" component={CreatePhrase} exact />
    </Switch>
  );
};

export default UnAuth;
