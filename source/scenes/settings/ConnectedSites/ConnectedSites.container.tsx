///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Types
///////////////////////////

import store, { RootState } from 'state/store';
import { removeDapp } from 'state/dapp';
import { StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { AvailableWalletEvent, ProtocolProvider } from 'scripts/common';
import { IConnectedSitesContainerProps } from './types';
import ConnectedSites from './ConnectedSites';

const ConnectedSitesContainer: FC<IConnectedSitesContainerProps> = () => {
  const connectedSites = useSelector((state: RootState) => state.dapp.whitelist);

  const onDeleteSiteClicked = async (id: string) => {
    store.dispatch(removeDapp({ id }));

    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.CONSTELLATION,
      AvailableWalletEvent.disconnect,
      [],
      [id]
    );
    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.ETHEREUM,
      AvailableWalletEvent.disconnect,
      [],
      [id]
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false}>
      <ConnectedSites
        onDeleteSiteClicked={onDeleteSiteClicked}
        connectedSites={connectedSites}
      />
    </Container>
  );
};

export default ConnectedSitesContainer;
