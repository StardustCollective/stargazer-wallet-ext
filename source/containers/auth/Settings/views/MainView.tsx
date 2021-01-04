import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import DAGIcon from 'assets/images/svg/dag.svg';
// import BTCIcon from 'assets/images/svg/btc.svg';
// import ETHIcon from 'assets/images/svg/eth.svg';
import { ACCOUNT_VIEW } from '../consts';
import styles from './MainView.scss';

const MainView = () => {
  const history = useHistory();
  const handleAccount = useCallback(() => {
    history.push(ACCOUNT_VIEW);
  }, []);

  return (
    <div className={styles.main}>
      <ul className={styles.accounts}>
        <li onClick={handleAccount}>
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
      <section className={styles.general}>
        <SettingsIcon className={styles.icon} />
        General Settings
      </section>
    </div>
  );
};

export default MainView;
