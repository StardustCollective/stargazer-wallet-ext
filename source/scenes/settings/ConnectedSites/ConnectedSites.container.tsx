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

import { getDappController } from 'utils/controllersUtils';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { IConnectedSitesContainerProps } from './types';

const ConnectedSitesContainer: FC<IConnectedSitesContainerProps> = () => {
  const connectedSites = useSelector((state: RootState) => state.dapp.whitelist);
  const DAppController = getDappController();

  const onDeleteSiteClicked = (id: string) => {
    if (DAppController) {
      DAppController.fromUserDisconnectDApp(id);
    }
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
