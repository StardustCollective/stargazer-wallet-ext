import React, { FC } from 'react';

import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { useLinkTo } from '@react-navigation/native';

import Container, { CONTAINER_COLOR } from 'components/Container';

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
    <Container color={CONTAINER_COLOR.LIGHT}>
      <ImportWallet handleImport={handleImport} onImportPhraseView={onImportPhraseView} />
    </Container>
  );
};

export default ImportWalletContainer;
