import React, { FC } from 'react';

import useVersion from 'hooks/useVersion';
import { useLinkTo } from '@react-navigation/native';

import { getWalletController } from 'utils/controllersUtils';
import Container from 'scenes/common/Container';
import Main from './Main';

const MainContainer: FC = () => {
  const walletController = getWalletController();
  const version = useVersion(3);
  const linkTo = useLinkTo();

  const handleLogout = () => {
    walletController.logOut();
    linkTo('/authRoot');
  };

  const onWalletLinkClick = () => {
    linkTo('/settings/wallets');
  };

  const onNetworkLinkClicked = () => {
    linkTo('/settings/networks');
  };

  const onAboutLinkClicked = () => {
    linkTo('/settings/about');
  };

  const onContactsLinkClicked = () => {
    linkTo('/settings/contacts');
  };

  const onConnectedSitesClicked = () => {
    linkTo('/settings/connectedSites');
  };

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
};

export default MainContainer;
