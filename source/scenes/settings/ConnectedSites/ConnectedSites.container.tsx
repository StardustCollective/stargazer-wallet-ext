///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';
import ConnectedSites from './ConnectedSites';

///////////////////////////
// Utils
///////////////////////////

import { sendDappMessage } from 'scripts/Background/messaging/messenger';
import { DappMessageID } from 'scripts/Background/messaging/types';

///////////////////////////
// Types
///////////////////////////

import store, { RootState } from 'state/store';
import { IConnectedSitesContainerProps } from './types';
import { removeDapp } from 'state/dapp';

const ConnectedSitesContainer: FC<IConnectedSitesContainerProps> = () => {
  const connectedSites = useSelector((state: RootState) => state.dapp.whitelist);

  const onDeleteSiteClicked = async (id: string) => {
    store.dispatch(removeDapp({ id }));
    await sendDappMessage(DappMessageID.disconnect, { origin: id });
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
