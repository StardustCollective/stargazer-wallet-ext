import React, { FC } from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import ConstellationIcon from 'assets/images/svg/constellation.svg';

import styles from './index.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { useLinkTo } from '@react-navigation/native';

// export enum ImportWalletType {
//   Ethereum,
//   Constellation,
//   MultiChain
// }

interface IImportWalletView {
}

const ImportWallet: FC<IImportWalletView> = () => {
  const linkTo = useLinkTo();

  const handleImport = (network: KeyringNetwork) => {
    linkTo(`/settings/wallets/import/account?network=${network}`);
  };

  const onImportPhraseView = () => {
    linkTo('/settings/wallets/import/phrase');
  }

  return (
    <div className={styles.wrapper}>
      <section
        className={styles.menu}
        onClick={onImportPhraseView}
      >
        <Icon Component={StargazerIcon} />
        <span>Multi Chain Wallet</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.menu}
        onClick={() => handleImport(KeyringNetwork.Ethereum)}
      >
        <Icon Component={EthereumIcon} />
        <span>Ethereum</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.menu}
        onClick={() => handleImport(KeyringNetwork.Constellation)}
      >
        <Icon Component={ConstellationIcon} />
        <span>Constellation</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default ImportWallet;
