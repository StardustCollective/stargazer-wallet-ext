import React from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import styles from './index.scss';
import { useLinkTo } from '@react-navigation/native';

const AddWallet = () => {
  const linkTo = useLinkTo();

  const onCreateNewWalletClicked = () => {
    linkTo('/settings/wallets/create');
  };

  const onImportWalletClicked = () => {
    linkTo('/settings/wallets/import');
  }

  return (
    <div className={styles.wrapper}>
      <section
        className={styles.menu}
        onClick={onCreateNewWalletClicked}
      >
        <Icon Component={StargazerIcon} />
        <span>Create New Wallet</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.menu}
        onClick={onImportWalletClicked}
      >
        <Icon Component={StargazerIcon} />
        <span>Import Wallet</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default AddWallet;
