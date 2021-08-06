import React, { FC } from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import ConstellationIcon from 'assets/images/svg/constellation.svg';

import styles from './index.scss';
import { useSettingsView } from 'hooks/index';
import { IMPORT_ACCOUNT_VIEW, IMPORT_PHRASE_VIEW } from '../routes';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

// export enum ImportWalletType {
//   Ethereum,
//   Constellation,
//   MultiChain
// }

interface IImportWalletView {
  onChange: (network: KeyringNetwork) => void;
}

const ImportWalletView: FC<IImportWalletView> = ({ onChange }) => {
  const showView = useSettingsView();

  const handleImport = (network: KeyringNetwork) => {
    onChange(network);
    showView(IMPORT_ACCOUNT_VIEW);
  };

  return (
    <div className={styles.wrapper}>
      <section
        className={styles.menu}
        onClick={() => showView(IMPORT_PHRASE_VIEW)}
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

export default ImportWalletView;
