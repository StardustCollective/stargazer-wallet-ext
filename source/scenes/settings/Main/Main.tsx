import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import walletIcon from 'assets/images/svg/wallet.svg';
import contactsIcon from 'assets/images/svg/contacts.svg';
import networksIcon from 'assets/images/svg/networks.svg';
import infoIcon from 'assets/images/svg/info.svg';
import exitIcon from 'assets/images/svg/exit.svg';
import linkedApps from 'assets/images/svg/linkedApps.svg';
import settingsIcon from 'assets/images/svg/settings-adjust.svg';
import { clearSession } from 'utils/keyring';
import NavigationItem from 'components/NavigationItem';
import IMainSettings from './types';
import styles from './Main.scss';

const Main: FC<IMainSettings> = ({
  handleLogout,
  onWalletLinkClick,
  onNetworkLinkClicked,
  onAboutLinkClicked,
  onContactsLinkClicked,
  onConnectedSitesClicked,
  onPersonalizeLinkClicked,
  version,
}) => {
  const SETTINGS_MAP = [
    {
      id: 'settings-wallets',
      label: 'Wallets',
      key: 'Wallets',
      IconImageOrComponent: walletIcon,
      onClick: onWalletLinkClick,
    },
    {
      id: 'settings-networks',
      label: 'Networks',
      key: 'Networks',
      IconImageOrComponent: networksIcon,
      onClick: onNetworkLinkClicked,
    },
    {
      id: 'settings-contacts',
      label: 'Contacts',
      key: 'Contacts',
      IconImageOrComponent: contactsIcon,
      onClick: onContactsLinkClicked,
    },
    {
      id: 'settings-connected-sites',
      label: 'Connected Sites',
      key: 'Connected Sites',
      IconImageOrComponent: linkedApps,
      onClick: onConnectedSitesClicked,
      imageStyles: styles.linkedIconImage,
    },
    {
      id: 'settings-personalize',
      label: 'Personalize',
      key: 'Personalize',
      IconImageOrComponent: settingsIcon,
      onClick: onPersonalizeLinkClicked,
      imageStyles: styles.personalizeIconImage,
    },
  ];

  const logout = async () => {
    handleLogout();
    await clearSession();
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <div className={styles.content}>
          {SETTINGS_MAP.map((section_props) => {
            return <NavigationItem {...section_props} />;
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
