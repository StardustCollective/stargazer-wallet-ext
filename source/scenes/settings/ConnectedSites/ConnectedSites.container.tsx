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
import { IConnectedSitesContainerProps } from './types';
import ConnectedSites from './ConnectedSites';
import {
  DappMessage,
  DappMessageEvent,
  MessageType,
} from 'scripts/Background/messaging/types';

const ConnectedSitesContainer: FC<IConnectedSitesContainerProps> = () => {
  const connectedSites = useSelector((state: RootState) => state.dapp.whitelist);

  const onDeleteSiteClicked = async (id: string) => {
    store.dispatch(removeDapp({ id }));

    const message: DappMessage = {
      type: MessageType.dapp,
      event: DappMessageEvent.disconnect,
      payload: { origin: id },
    };

    chrome.runtime.sendMessage(message);
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
