import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import Menu from 'components/Menu';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import IImportWalletSettings from './types';
import styles from './styles';

const ICON_SIZE = 36;

const ImportWallet: FC<IImportWalletSettings> = ({
  handleImport,
  onImportPhraseView,
}) => {
  const MULTI_CHAIN_OPTION = [
    {
      title: 'Multi-chain wallet',
      icon: <StargazerIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onClick: onImportPhraseView,
    },
  ];

  const SINGLE_CHAIN_OPTIONS = [
    {
      title: 'Ethereum',
      icon: ETHEREUM_LOGO,
      onClick: handleImport(KeyringNetwork.Ethereum),
    },
    {
      title: 'Constellation',
      icon: CONSTELLATION_LOGO,
      onClick: handleImport(KeyringNetwork.Constellation),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Menu items={MULTI_CHAIN_OPTION} />
      <Menu items={SINGLE_CHAIN_OPTIONS} />
    </ScrollView>
  );
};

export default ImportWallet;
