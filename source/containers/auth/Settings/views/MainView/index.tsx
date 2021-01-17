import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import UserIcon from '@material-ui/icons/AccountCircleRounded';

import Icon from 'components/Icon';
import { useSettingsView } from 'hooks/index';
import { ACCOUNT_VIEW, GENERAL_VIEW } from '../routes';
import styles from './index.scss';

const MainView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.main}>
      <ul className={styles.accounts}>
        <li onClick={() => showView(ACCOUNT_VIEW)}>
          <div className={styles.account}>
            <span className={styles.accInfo}>
              <Icon Component={UserIcon} />
              <div>
                Account 1<small>1,000,000 DAG</small>
              </div>
            </span>
          </div>
        </li>
      </ul>
      <section className={styles.new}>
        <Icon Component={AddIcon} />
        Create New Account
      </section>
      <section
        className={styles.general}
        onClick={() => showView(GENERAL_VIEW)}
      >
        <Icon Component={SettingsIcon} />
        General Settings
      </section>
    </div>
  );
};

export default MainView;
