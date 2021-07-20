import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LogOutIcon from '@material-ui/icons/ExitToApp';
import ContactsIcon from '@material-ui/icons/Group';
import NetworkIcon from '@material-ui/icons/Timeline';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import WalletIcon from 'assets/images/svg/wallet.svg';
import Icon from 'components/Icon';
import { useController, useSettingsView } from 'hooks/index';
import { browser } from 'webextension-polyfill-ts';


import {
  ABOUT_VIEW,
  CONTACTS_VIEW,
  NETWORKS_VIEW,
  WALLETS_VIEW,
} from '../routes';

import styles from './index.scss';

const ICON_WIDTH_NUMBER = 14;

const MainView: FC = () => {
  const showView = useSettingsView();
  const history = useHistory();
  const controller = useController();
  const [ version ] = useState(browser.runtime.getManifest().version)

  const handleLogout = () => {
    controller.wallet.logOut();
    history.push('/app.html');
  };

  return (
    <div className={styles.main}>
      <div>
        <section
          className={styles.general}
          onClick={() => showView(WALLETS_VIEW)}
        >
          <Icon Component={WalletIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Wallets</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section
          className={styles.general}
          onClick={() => showView(CONTACTS_VIEW)}
        >
          <Icon Component={ContactsIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
          <span>Contacts</span>
          <ArrowIcon className={styles.arrow} />
        </section>
        <section
          className={styles.general}
          onClick={() => showView(NETWORKS_VIEW)}
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
        <section className={styles.general} onClick={() => showView(ABOUT_VIEW)}>
          <Icon Component={InfoIcon} width={ICON_WIDTH_NUMBER} variant={styles.icon} />
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

export default MainView;
