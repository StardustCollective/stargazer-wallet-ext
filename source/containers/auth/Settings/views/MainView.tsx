import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import DAGIcon from 'assets/images/svg/dag.svg';
import BTCIcon from 'assets/images/svg/btc.svg';
import ETHIcon from 'assets/images/svg/eth.svg';
import styles from './View.scss';

const MainView = () => {
  return (
    <div className={styles.main}>
      <ul className={styles.accounts}>
        <li>
          <div className={styles.account}>
            <img src={DAGIcon} />
            <span className={styles.accInfo}>
              Account 1<small>1,000,000 DAG</small>
            </span>
          </div>
          <IconButton className={styles.moreBtn}>
            <MoreHorizIcon />
          </IconButton>
        </li>
        <li>
          <div className={styles.account}>
            <img src={ETHIcon} />
            <span className={styles.accInfo}>
              Account 2<small>1,000,000 DAG</small>
            </span>
          </div>
          <IconButton className={styles.moreBtn}>
            <MoreHorizIcon />
          </IconButton>
        </li>
        <li>
          <div className={styles.account}>
            <img src={BTCIcon} />
            <span className={styles.accInfo}>
              Account 3<small>1,000,000 DAG</small>
            </span>
          </div>
          <IconButton className={styles.moreBtn}>
            <MoreHorizIcon />
          </IconButton>
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
