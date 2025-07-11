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

  const onConnectHardwareWalletClicked = () => {
    linkTo('/settings/wallets/hardware');
  };

  return (
    <Container>
      <Wallets
        onCreateNewWalletClicked={onCreateNewWalletClicked}
        onImportWalletClicked={onImportWalletClicked}
        onConnectHardwareWalletClicked={onConnectHardwareWalletClicked}
      />
    </Container>
  );
};

export default WalletsContainer;
