import React, { FC } from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import styles from './AddWallet.scss';
import IAddWalletSettings from './types';

const AddWallet: FC<IAddWalletSettings> = ({
  onCreateNewWalletClicked,
  onImportWalletClicked,
}) => {
  return (
    <div className={styles.wrapper}>
      <section
        id="addWallet-createNewWallet"
        className={styles.menu}
        onClick={onCreateNewWalletClicked}
      >
        <Icon width={36} Component={StargazerIcon} iconStyles={styles.icon} />
        <span>Create New Wallet</span>
        <ArrowIcon />
      </section>
      <section
        id="addWallet-importWallet"
        className={styles.menu}
        onClick={onImportWalletClicked}
      >
        <Icon width={36} Component={StargazerIcon} iconStyles={styles.icon} />
        <span>Import Wallet</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default AddWallet;
