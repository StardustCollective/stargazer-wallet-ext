///////////////////////
// Modules
///////////////////////

import React, {FC} from 'react';

///////////////////////
// Components
///////////////////////

import Container from 'scenes/common/Container';

///////////////////////
// Scene
///////////////////////

import Main from './Main';

///////////////////////
// Hooks
///////////////////////

import { useController } from 'hooks/index';
// import useVersion from 'hooks/useVersion';
import { useLinkTo } from '@react-navigation/native';

///////////////////////
// Component
///////////////////////

const MainContainer:FC = () => {

  ///////////////////////
  // Hooks
  ///////////////////////

  //   const controller = useController();
  // const version = useVersion(3);
  const version = 3.34;
  const linkTo = useLinkTo();

  ///////////////////////
  // Callbacks
  ///////////////////////

  const handleLogout = () => {
    // controller.wallet.logOut();
    linkTo('/authRoot');
  };

  const onWalletLinkClick = () => {
    linkTo('/settings/wallets');
  }

  const onNetworkLinkClicked = () => {
    linkTo('/settings/networks');
  };

  const onAboutLinkClicked = () => {
    linkTo('/settings/about');
  }

  const onContactsLinkClicked = () => {
    linkTo('/settings/contacts');
  }

  const onConnectedSitesClicked = () => {
    linkTo('/settings/connectedSites')
  }


  ///////////////////////
  // Render
  ///////////////////////

  return (
    <Container>
      <Main
        handleLogout={handleLogout}
        onWalletLinkClick={onWalletLinkClick}
        onNetworkLinkClicked={onNetworkLinkClicked}
        onAboutLinkClicked={onAboutLinkClicked}
        onContactsLinkClicked={onContactsLinkClicked}
        onConnectedSitesClicked={onConnectedSitesClicked}
        version={version}
      />
    </Container>
  );

}

export default MainContainer;