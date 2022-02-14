import React, { FC } from 'react';

import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { useLinkTo } from '@react-navigation/native';

import Container from 'scenes/common/Container';

import ImportWallet from './ImportWallet';

import { IImportWalletView } from './types';

const ImportWalletContainer: FC<IImportWalletView> = () => {
  const linkTo = useLinkTo();

  const handleImport = (network: KeyringNetwork) => {
    return () => linkTo(`/settings/wallets/import/account?network=${network}`);
  };

  const onImportPhraseView = () => {
    linkTo('/settings/wallets/import/phrase');
  };

  return (
    <Container>
      <ImportWallet handleImport={handleImport} onImportPhraseView={onImportPhraseView} />
    </Container>
  );
};

export default ImportWalletContainer;
