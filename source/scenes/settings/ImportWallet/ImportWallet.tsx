import React, { FC } from 'react';
import Menu from 'components/Menu';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import IImportWalletSettings from './types';
import styles from './ImportWallet.scss';

const ImportWallet: FC<IImportWalletSettings> = ({
  handleImport,
  onImportPhraseView,
}) => {
  const MULTI_CHAIN_OPTION = [
    {
      title: 'Multi-chain wallet',
      icon: StargazerIcon,
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
    <div className={styles.container}>
      <Menu items={MULTI_CHAIN_OPTION} />
      <Menu items={SINGLE_CHAIN_OPTIONS} />
    </div>
  );
};

export default ImportWallet;
