import React, { FC } from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import ConstellationIcon from 'assets/images/svg/constellation.svg';

import styles from './index.scss';
import { useSettingsView } from 'hooks/index';
import { IMPORT_ACCOUNT_VIEW, IMPORT_PHRASE_VIEW } from '../routes';
import { NetworkType } from 'state/wallet/types';

interface IImportWalletView {
  onChange: (network: NetworkType) => void;
}

const ImportWalletView: FC<IImportWalletView> = ({ onChange }) => {
  const showView = useSettingsView();

  const handleImport = (network: NetworkType) => {
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
        onClick={() => handleImport(NetworkType.Ethereum)}
      >
        <Icon Component={EthereumIcon} />
        <span>Ethereum</span>
        <ArrowIcon />
      </section>
      <section
        className={styles.menu}
        onClick={() => handleImport(NetworkType.Constellation)}
      >
        <Icon Component={ConstellationIcon} />
        <span>Constellation</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default ImportWalletView;
