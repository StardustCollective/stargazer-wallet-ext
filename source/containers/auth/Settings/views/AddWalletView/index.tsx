import React from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import styles from './index.scss';
import { useSettingsView } from 'hooks/index';
import { IMPORT_WALLET_VIEW, NEW_ACCOUNT_VIEW } from '../routes';

const AddWalletView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.wrapper}>
      <section
        className={styles.menu}
        onClick={() => showView(NEW_ACCOUNT_VIEW)}
      >
        <Icon Component={StargazerIcon} />
        <span>Create New Wallet</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.menu}
        onClick={() => showView(IMPORT_WALLET_VIEW)}
      >
        <Icon Component={StargazerIcon} />
        <span>Import Wallet</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default AddWalletView;
