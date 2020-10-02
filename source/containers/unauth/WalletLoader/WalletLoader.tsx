import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from 'containers/common/Header';
import FormWizard from 'components/FormWizard';

import WelcomeWallet from '../Welcome';

const WalletLoader = () => {
  const routes = ['/wallet/welcome'];

  return (
    <FormWizard routes={routes}>
      <Header />
      <Switch>
        <Route path="/wallet/welcome">
          <WelcomeWallet />
        </Route>
      </Switch>
    </FormWizard>
  );
};

export default WalletLoader;
