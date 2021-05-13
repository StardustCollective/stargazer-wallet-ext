import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import Container from 'containers/common/Container';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';

import 'assets/styles/global.scss';

const ConfirmPage: FC = () => {
  const { keystores, seedKeystoreId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <section id="confirm-page" style={{ minHeight: '300px' }}>
      <Container>
        {keystores && seedKeystoreId && keystores[seedKeystoreId] ? (
          <span>Logged in</span>
        ) : (
          <span>Locked</span>
        )}
      </Container>
    </section>
  );
};

export default ConfirmPage;
