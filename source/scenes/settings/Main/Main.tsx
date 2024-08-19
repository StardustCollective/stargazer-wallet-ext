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
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Constants
///////////////////////
import walletIcon from 'assets/images/svg/wallet.svg';
import contactsIcon from 'assets/images/svg/contacts.svg';
import networksIcon from 'assets/images/svg/networks.svg';
import infoIcon from 'assets/images/svg/info.svg';
import exitIcon from 'assets/images/svg/exit.svg';
import linkedApps from 'assets/images/svg/linkedApps.svg';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';

///////////////////////
// Styles
///////////////////////

import styles from './Main.scss';

///////////////////////
// Types
///////////////////////

import IMainSettings, { IRenderSettingsItemProps } from './types';
import { clearSession } from 'utils/keyring';

///////////////////////
// Scene
///////////////////////

const Main: FC<IMainSettings> = ({
  handleLogout,
  onWalletLinkClick,
  onNetworkLinkClicked,
  onAboutLinkClicked,
  onContactsLinkClicked,
  onConnectedSitesClicked,
  version,
}) => {
  const RenderSettingsItem = ({
    label,
    IconImageOrComponent,
    imageStyles = '',
    onClick,
  }: IRenderSettingsItemProps) => {
    ///////////////////////
    // Renders
    ///////////////////////
    return (
      <Card id={'settings-' + label.toLowerCase()} onClick={onClick}>
        <div className={styles.settingsItemIconWrapper}>
          <div className={styles.iconCircle}>
            <img src={'/' + IconImageOrComponent} className={imageStyles} />
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.settingsItemLabelWrapper}>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
              {label}
            </TextV3.BodyStrong>
          </div>
          <div className={styles.arrowRightContainer}>
            <img src={`/${ArrowRightIcon}`} />
          </div>
        </div>
      </Card>
    );
  };

  const SETTINGS_MAP = [
    {
      label: 'Wallets',
      key: 'Wallets',
      IconImageOrComponent: walletIcon,
      onClick: onWalletLinkClick,
    },
    {
      label: 'Networks',
      key: 'Networks',
      IconImageOrComponent: networksIcon,
      onClick: onNetworkLinkClicked,
    },
    {
      label: 'Contacts',
      key: 'Contacts',
      IconImageOrComponent: contactsIcon,
      onClick: onContactsLinkClicked,
    },
    {
      label: 'Connected Sites',
      key: 'Connected Sites',
      IconImageOrComponent: linkedApps,
      onClick: onConnectedSitesClicked,
      imageStyles: styles.linkedIconImage,
    },
  ];

  const logout = async () => {
    await clearSession();
    handleLogout();
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <div className={styles.content}>
          {SETTINGS_MAP.map((section_props) => {
            return <RenderSettingsItem {...section_props} />;
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <div onClick={onAboutLinkClicked} className={styles.footer__left}>
          <img src={'/' + infoIcon} />
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            Stargazer Wallet {version}
          </TextV3.Caption>
        </div>
        <div id={'wallet-logoutButton'} onClick={logout} className={styles.footer__right}>
          <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>Logout</TextV3.Caption>
          <img src={'/' + exitIcon} />
        </div>
      </div>
    </div>
  );
};

export default Main;
