import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Start from 'containers/unauth/Start';
import Remind from 'containers/unauth/Remind';
import CreatePass from 'containers/unauth/CreatePass';
import { CreatePhrase, ConfirmPhrase } from 'containers/unauth/Phrase';

const UnAuth = () => {
  return (
    <Switch>
      <Route path="/app.html" component={Start} exact />
      <Route path="/remind" component={Remind} exact />
      <Route path="/create/pass" component={CreatePass} exact />
      <Route path="/create/phrase/generated" component={CreatePhrase} exact />
      <Route path="/create/phrase/checking" component={ConfirmPhrase} exact />
    </Switch>
  );
};

export default UnAuth;
