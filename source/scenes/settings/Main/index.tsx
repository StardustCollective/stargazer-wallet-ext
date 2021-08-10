import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import AboutIcon from 'assets/images/svg/about.svg';
import NetworkIcon from 'assets/images/svg/network.svg';
import ContactsIcon from 'assets/images/svg/contacts.svg';
import LogOutIcon from 'assets/images/svg/logout.svg';
import WalletIcon from 'assets/images/svg/wallet.svg';

import Icon from 'components/Icon';
import { useController, useSettingsView } from 'hooks/index';
import useVersion from 'hooks/useVersion';
import { useLinkTo } from '@react-navigation/native';

import styles from './index.scss';

const ICON_WIDTH_NUMBER = 25;

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

  return (
    <div className={styles.main}>
      <div>
        <section
          className={styles.general}
          onClick={onWalletLinkClick}
        >
          <Icon Component={WalletIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Wallets</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section
          className={styles.general}
          onClick={onContactsLinkClicked}
        >
          <Icon Component={ContactsIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Contacts</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section
          className={styles.general}
          onClick={onNetworkLinkClicked}
        >
          <Icon Component={NetworkIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Networks</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section className={styles.general} onClick={handleLogout}>
          <Icon Component={LogOutIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Log out</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section className={styles.general} 
        onClick={onAboutLinkClicked}
        >
          <Icon Component={AboutIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>About</span>
          <ArrowIcon className={styles.arrow} />
        </section>
      </div>
      <div className={styles.footer}>
        <div >
          <span>Version {version}</span>
        </div>
      </div>
    </div>
  );
};

export default Main;
