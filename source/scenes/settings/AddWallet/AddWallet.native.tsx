import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import NavigationItem from 'components/NavigationItem';
import WalletIcon from 'assets/images/svg/wallet.svg';
import AddWalletSettings from './types';
import styles from './styles';

const AddWallet: FC<AddWalletSettings> = ({
  onCreateNewWalletClicked,
  onImportWalletClicked,
}) => {
  const ADD_WALLET_OPTIONS = [
    {
      id: 'addWallet-createNewWallet',
      label: 'Create new wallet',
      key: 'Create new wallet',
      IconImageOrComponent: WalletIcon,
      onClick: onCreateNewWalletClicked,
    },
    {
      id: 'addWallet-importWallet',
      label: 'Import wallet',
      key: 'Import wallet',
      IconImageOrComponent: WalletIcon,
      onClick: onImportWalletClicked,
    },
  ];
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {ADD_WALLET_OPTIONS.map((optionProps) => {
        return <NavigationItem {...optionProps} />;
      })}
    </ScrollView>
  );
};

export default AddWallet;
