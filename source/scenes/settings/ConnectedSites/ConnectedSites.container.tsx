import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'state/store';

// import DAppController from 'scripts/Background/controllers/DAppController';
import Container from 'scenes/common/Container';

// import defaultHeader from 'navigation/headers/default';

import ConnectedSites from './ConnectedSites';

import { IConnectedSitesContainerProps } from './types';

const ConnectedSitesContainer: FC<IConnectedSitesContainerProps> = ({ navigation }) => {
  const connectedSites = useSelector((state: RootState) => state.dapp.whitelist);

  // useLayoutEffect(() => {
  //   // navigation.setOptions(defaultHeader({ navigation }));
  // }, []);

  const onDeleteSiteClicked = (id: string) => {
    // DAppController.fromUserDisconnectDApp(id);
  };

  return (
    <Container>
      <ConnectedSites onDeleteSiteClicked={onDeleteSiteClicked} connectedSites={connectedSites} />
    </Container>
  );
};

export default ConnectedSitesContainer;
