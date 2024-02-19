import React, { FC } from 'react';

import { useLinkTo } from '@react-navigation/native';

import Container from 'components/Container';

import Wallets from './AddWallet';

import { IAddWalletView } from './types';

const WalletsContainer: FC<IAddWalletView> = () => {
  const linkTo = useLinkTo();

  const onCreateNewWalletClicked = () => {
    linkTo('/settings/wallets/create');
  };

  const onImportWalletClicked = () => {
    linkTo('/settings/wallets/import');
  };

  return (
    <Container safeArea={false}>
      <Wallets
        onCreateNewWalletClicked={onCreateNewWalletClicked}
        onImportWalletClicked={onImportWalletClicked}
      />
    </Container>
  );
};

export default WalletsContainer;
