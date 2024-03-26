import React, { FC } from 'react';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Icon from 'components/Icon';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import styles from './ImportWallet.scss';
import IImportWalletSettings from './types';

const ImportWallet: FC<IImportWalletSettings> = ({
  handleImport,
  onImportPhraseView,
}) => {
  return (
    <div className={styles.wrapper}>
      <section
        id="importWallet-multiChainWallet"
        className={styles.menu}
        onClick={onImportPhraseView}
      >
        <Icon width={36} Component={StargazerIcon} iconStyles={styles.icon} />
        <span>Multi Chain Wallet</span>
        <ArrowIcon />
      </section>
      <section
        id="importWallet-ethereum"
        className={styles.menu}
        onClick={handleImport(KeyringNetwork.Ethereum)}
      >
        <img src={ETHEREUM_LOGO} className={styles.logo} />
        <span>Ethereum</span>
        <ArrowIcon />
      </section>
      <section
        id="importWallet-constellation"
        className={styles.menu}
        onClick={handleImport(KeyringNetwork.Constellation)}
      >
        <img src={CONSTELLATION_LOGO} className={styles.logo} />
        <span>Constellation</span>
        <ArrowIcon />
      </section>
    </div>
  );
};

export default ImportWallet;
