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
}

///////////////////////
// Constants
///////////////////////

const ICON_WIDTH_NUMBER = 25;

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


  const RenderSettingsItem = ({ label, iconImage, onClick }: IRenderSettingsItemProps) => {

    return (
      <Card onClick={onClick}>
        <div className={styles.settingsItemIconWrapper}>
          <div className={styles.iconCircle}>
            <img src={'/' + iconImage} />
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
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footer__left}>
          <TextV3.Caption>
            Stargazer Wallet {version}
          </TextV3.Caption>
        </div>
        <div onClick={handleLogout} className={styles.footer__right}>
          <TextV3.Caption>
            Logout
          </TextV3.Caption>
        </div>
      </div>
    </div>
  );
};

export default Main;
