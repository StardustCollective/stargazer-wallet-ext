import React from 'react';
import { useSelector } from 'react-redux';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import Icon from 'components/Icon';
import { RootState } from 'state/store';
import IWalletState, { AccountType } from 'state/wallet/types';
import { useSettingsView } from 'hooks/index';

import StargazerIcon from 'assets/images/logo-s.svg';
import styles from './index.scss';
import { MANAGE_WALLET_VIEW } from '../routes';

const WalletsView = () => {
  const showView = useSettingsView();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <div className={styles.wallets}>
      <label>Multi chain wallets</label>
      <div className={styles.group}>
        {Object.values(accounts)
          .filter((account) => account.type === AccountType.Seed)
          .map((account) => (
            <section
              className={styles.wallet}
              key={account.id}
              onClick={() => showView(MANAGE_WALLET_VIEW)}
            >
              {account.id === activeAccountId && (
                <CheckIcon className={styles.check} />
              )}
              <Icon Component={StargazerIcon} />
              <span>
                {account.label}
                <small>Multi Chain Wallet</small>
              </span>
              <InfoIcon />
            </section>
          ))}
      </div>
      <label>Private key wallets</label>
      <div className={styles.group}>
        {Object.values(accounts)
          .filter((account) => account.type === AccountType.PrivKey)
          .map((account) => (
            <section
              className={styles.wallet}
              key={account.id}
              onClick={() => showView(MANAGE_WALLET_VIEW)}
            >
              {account.id === activeAccountId && (
                <CheckIcon className={styles.check} />
              )}
              <Icon Component={StargazerIcon} />
              <span>
                {account.label}
                <small>Private Key Wallet</small>
              </span>
              <InfoIcon />
            </section>
          ))}
      </div>
    </div>
  );
};

export default WalletsView;
