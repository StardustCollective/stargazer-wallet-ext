import React, { FC } from 'react';
import NavigationItem from 'components/NavigationItem';
import WalletIcon from 'assets/images/svg/wallet.svg';
import IAddWalletSettings from './types';
import styles from './AddWallet.scss';

const AddWallet: FC<IAddWalletSettings> = ({
  onCreateNewWalletClicked,
  onImportWalletClicked,
  onConnectHardwareWalletClicked,
}) => {
  const ADD_WALLET_OPTIONS = [
    {
      id: 'addWallet-createNewWallet',
      label: 'Create new wallet',
      IconImageOrComponent: WalletIcon,
      onClick: onCreateNewWalletClicked,
    },
    {
      id: 'addWallet-importWallet',
      label: 'Import wallet',
      IconImageOrComponent: WalletIcon,
      onClick: onImportWalletClicked,
    },
    {
      id: 'addWallet-connectHardwareWallet',
      label: 'Connect hardware wallet',
      IconImageOrComponent: WalletIcon,
      onClick: onConnectHardwareWalletClicked,
    },
  ];
  return (
    <div className={styles.container}>
      {ADD_WALLET_OPTIONS.map((option) => (
        <NavigationItem
          key={option.id}
          id={option.id}
          label={option.label}
          IconImageOrComponent={option.IconImageOrComponent}
          onClick={option.onClick}
        />
      ))}
    </div>
  );
};

export default AddWallet;
