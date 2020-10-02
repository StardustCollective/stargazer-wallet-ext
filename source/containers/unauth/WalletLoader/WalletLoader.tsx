import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from 'containers/common/Header';
import FormWizard from 'components/FormWizard';

import WelcomeWallet from '../Welcome';

// import styles from './WalletLoader.scss';

const WalletLoader = () => {
  const routes = ['/wallet/welcome'];

  return (
    <FormWizard routes={routes}>
      <Header />
      <Switch>
        <Route path="/wallet/welcome" component={WelcomeWallet} />
        <Redirect to="/wallet/welocme" />
      </Switch>
    </FormWizard>
  );
};

export default WalletLoader;
