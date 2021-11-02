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
        id='addWallet-createNewWallet'
        className={styles.menu}
        onClick={onCreateNewWalletClicked}
      >
        <Icon width={24} Component={StargazerIcon} iconStyles={styles.icon} />
        <span>Create New Wallet</span>
        <ArrowIcon />
      </section>
      <section
        id='addWallet-importWallet'
        className={styles.menu}
        onClick={onImportWalletClicked}
      >
        <Icon width={24} Component={StargazerIcon} iconStyles={styles.icon} />
        <span>Import Wallet</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default AddWallet;
