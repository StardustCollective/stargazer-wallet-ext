import React from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/logo-s.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import ConstellationIcon from 'assets/images/svg/constellation.svg';

import styles from './index.scss';
import { useSettingsView } from 'hooks/index';
import { IMPORT_ACCOUNT_VIEW, NEW_ACCOUNT_VIEW } from '../routes';

const ImportWalletView = () => {
  const showView = useSettingsView();

  const handleImport = () => {
    showView(IMPORT_ACCOUNT_VIEW);
  };

  return (
    <div className={styles.wrapper}>
      <section
        className={styles.menu}
        onClick={() => showView(NEW_ACCOUNT_VIEW)}
      >
        <Icon Component={StargazerIcon} />
        <span>Multi Chain Wallet</span>
        <ArrowIcon />
      </section>
      <section className={styles.menu} onClick={handleImport}>
        <Icon Component={EthereumIcon} />
        <span>Ethereum</span>
        <ArrowIcon />
      </section>
      <section className={styles.menu} onClick={handleImport}>
        <Icon Component={ConstellationIcon} />
        <span>Constellation</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default ImportWalletView;
