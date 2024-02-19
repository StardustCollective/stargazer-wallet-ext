import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from 'components/Link';
import LogoImage from 'assets/images/logo-s.svg';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import styles from './Header.scss';

interface IHeader {
  backLink?: string;
  showLogo?: boolean;
}

const Header: FC<IHeader> = ({ showLogo = false, backLink = '#' }) => {
  const toLink = useLinkTo();
  const navigation = useNavigation();
  const [showed, showSettings] = useState(false);
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const hasMainAccount =
    wallets.local.length &&
    wallets.local.some((w: any) => w.type === KeyringWalletType.MultiChainWallet);

  const handleBack = () => {
    showSettings(false);
    if (backLink === '#') {
      navigation.goBack();
    } else {
      toLink(backLink);
    }
  };

  const handleCloseSettings = () => {
    showSettings(false);
  };

  return (
    <div className={styles.header}>
      {showed ? (
        <i style={{ width: '83px' }}></i>
      ) : showLogo ? (
        <Link onClick={handleCloseSettings}>
          <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
        </Link>
      ) : (
        <IconButton className={`${styles.button} ${styles.back}`} onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <span className={styles.title}>Stargazer</span>
      {hasMainAccount ? (
        <IconButton
          className={`${styles.button} ${styles.more}`}
          onClick={() => (showed ? handleCloseSettings() : showSettings(!showed))}
        >
          <MoreVertIcon />
        </IconButton>
      ) : (
        <i style={{ width: '70px' }} />
      )}
    </div>
  );
};

export default Header;
