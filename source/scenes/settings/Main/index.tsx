///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import walletIcon from 'assets/images/svg/wallet.svg'
import contactsIcon from 'assets/images/svg/contacts.svg'
import networksIcon from 'assets/images/svg/networks.svg'
import infoIcon from 'assets/images/svg/info.svg'
import exitIcon from 'assets/images/svg/exit.svg'
import linkedApps from 'assets/images/svg/linkedApps.svg'

///////////////////////
// Hooks
///////////////////////
import { useController } from 'hooks/index';
import useVersion from 'hooks/useVersion';
import { useLinkTo } from '@react-navigation/native';

///////////////////////
// Styles
///////////////////////

import styles from './index.scss';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

type IRenderSettingsItemProps = {
  label: string;
  iconImage: string;
  onClick: () => void;
  imageStyles?: string;
}

///////////////////////
// Constants
///////////////////////


///////////////////////
// Scene
///////////////////////

const Main: FC = () => {
  const controller = useController();
  const version = useVersion(3);
  const linkTo = useLinkTo();

  const handleLogout = () => {
    controller.wallet.logOut();
    linkTo('/app.html');
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


  const RenderSettingsItem = ({ label, iconImage, imageStyles, onClick }: IRenderSettingsItemProps) => {

    return (
      <Card onClick={onClick}>
        <div className={styles.settingsItemIconWrapper}>
          <div className={styles.iconCircle}>
            <img src={'/' + iconImage} className={imageStyles} />
          </div>
        </div>
        <div className={styles.settingsItemLabelWrapper}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
            {label}
          </TextV3.BodyStrong>
        </div>
      </Card>
    );

  }

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <div className={styles.content}>
          <RenderSettingsItem
            label={"Wallets"}
            iconImage={walletIcon}
            onClick={onWalletLinkClick}
          />
          <RenderSettingsItem
            label={"Contacts"}
            iconImage={contactsIcon}
            onClick={onContactsLinkClicked}
          />
          <RenderSettingsItem
            label={"Networks"}
            iconImage={networksIcon}
            onClick={onNetworkLinkClicked}
          />
          <RenderSettingsItem
            label={"Connected Sites"}
            iconImage={linkedApps}
            onClick={onConnectedSitesClicked}
            imageStyles={styles.linkedIconImage}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div onClick={onAboutLinkClicked} className={styles.footer__left}>
          <img src={'/'+ infoIcon} />
          <TextV3.Caption>
            Stargazer Wallet {version}
          </TextV3.Caption>
        </div>
        <div onClick={handleLogout} className={styles.footer__right}>
          <TextV3.Caption>
            Logout
          </TextV3.Caption>
          <img src={'/'+ exitIcon} />
        </div>
      </div>
    </div>
  );
};

export default Main;
