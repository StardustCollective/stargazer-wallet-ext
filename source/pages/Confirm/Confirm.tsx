import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import Container from 'containers/common/Container';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import WalletConnect from 'containers/confirm/WalletConnect';
import SignatureRequest from 'containers/confirm/SignatureRequest';

import 'assets/styles/global.scss';
import { useController } from 'hooks/index';
import Starter from 'containers/auth/Start';
import Import from 'containers/common/Import';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const ConfirmPage: FC = () => {
  const controller = useController();
  const { keystores, seedKeystoreId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const isUnlocked = !controller.wallet.isLocked();

  return (
    <section id="confirm-page" style={{ minHeight: '300px' }}>
      <Container>
        {keystores &&
        seedKeystoreId &&
        keystores[seedKeystoreId] &&
        isUnlocked ? (
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
