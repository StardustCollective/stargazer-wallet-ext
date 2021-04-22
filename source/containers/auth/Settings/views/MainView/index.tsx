import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import LogOutIcon from '@material-ui/icons/ExitToApp';
import ContactsIcon from '@material-ui/icons/Group';
import NetworkIcon from '@material-ui/icons/Timeline';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Icon from 'components/Icon';
import { useController, useSettingsView } from 'hooks/index';
import StargazerIcon from 'assets/images/logo-s.svg';

import {
  ABOUT_VIEW,
  CONTACTS_VIEW,
  NETWORKS_VIEW,
  WALLETS_VIEW,
} from '../routes';

import styles from './index.scss';

const MainView: FC = () => {
  const showView = useSettingsView();
  const history = useHistory();
  const controller = useController();

  const handleLogout = () => {
    controller.wallet.logOut();
    history.push('/app.html');
  };

  return (
    <div className={styles.main}>
      <section
        className={styles.general}
        onClick={() => showView(WALLETS_VIEW)}
      >
        <Icon Component={StargazerIcon} />
        <span>Wallets</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.general}
        onClick={() => showView(CONTACTS_VIEW)}
      >
        <Icon Component={ContactsIcon} />
        <span>Contacts</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.general}
        onClick={() => showView(NETWORKS_VIEW)}
      >
        <Icon Component={NetworkIcon} />
        <span>Networks</span>
        <ArrowIcon />
      </section>
      <section className={styles.general} onClick={handleLogout}>
        <Icon Component={LogOutIcon} />
        <span>Log out</span>
        <ArrowIcon />
      </section>
      <section className={styles.general} onClick={() => showView(ABOUT_VIEW)}>
        <Icon Component={InfoIcon} />
        <span>About</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default MainView;
