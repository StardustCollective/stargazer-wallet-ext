import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Container from 'containers/common/Container';
import AuthRouter from 'routers/Auth';
import UnAuthRouter from 'routers/UnAuth';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';

import 'assets/styles/global.scss';

const App: FC = () => {

  const { wallets, hasEncryptedVault, migrateWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  return (
    <section id="app" style={{ minHeight: '300px' }}>
      <Container>
        <Router>
          {migrateWallet || (wallets && Object.values(wallets).length > 0) || hasEncryptedVault ? (
            <AuthRouter />
          ) : (
            <UnAuthRouter />
          )}
        </Router>
      </Container>
    </section>
  );
};

export default App;
