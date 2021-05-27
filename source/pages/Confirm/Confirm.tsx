import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import Container from 'containers/common/Container';
import { RootState } from 'state/store';
import WalletConnect from 'containers/confirm/WalletConnect';
import SignatureRequest from 'containers/confirm/SignatureRequest';

import 'assets/styles/global.scss';
import { useController } from 'hooks/index';
import Starter from 'containers/auth/Start';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IVaultState from '../../state/vault/types';

const ConfirmPage: FC = () => {
  const controller = useController();
  const { wallets }: IVaultState = useSelector( (state: RootState) => state.vault );
  const isUnlocked = controller.wallet.isUnlocked();

  return (
    <section id="confirm-page" style={{ minHeight: '300px' }}>
      <Container>
        {wallets && isUnlocked ? (
          window.location.hash.startsWith('#signMessage') ? (
            <SignatureRequest />
          ) : (
            <WalletConnect />
          )
        ) : (
          <Router>
            <Switch>
              <Route path="/confirm.html" component={Starter} exact />
            </Switch>
          </Router>
        )}
      </Container>
    </section>
  );
};

export default ConfirmPage;
