import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import { useSettingsView } from 'hooks/index';
import DAGIcon from 'assets/images/svg/dag.svg';
// import BTCIcon from 'assets/images/svg/btc.svg';
// import ETHIcon from 'assets/images/svg/eth.svg';
import { ACCOUNT_VIEW, GENERAL_VIEW } from '../consts';
import styles from './index.scss';

const MainView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.main}>
      <ul className={styles.accounts}>
        <li onClick={() => showView(ACCOUNT_VIEW)}>
          <div className={styles.account}>
            <img src={DAGIcon} />
            <span className={styles.accInfo}>
              Account 1<small>1,000,000 DAG</small>
            </span>
          </div>
        </li>
      </ul>
      <section className={styles.new}>
        <AddIcon className={styles.icon} />
        Create New Account
      </section>
      <section
        className={styles.general}
        onClick={() => showView(GENERAL_VIEW)}
      >
        <SettingsIcon className={styles.icon} />
        General Settings
      </section>
    </div>
  );
};

export default MainView;
