import React, { FC, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import Icon from 'components/Icon';
import { RootState } from 'state/store';
import IWalletState, { AccountType } from 'state/wallet/types';
import { useController, useSettingsView } from 'hooks/index';

import StargazerIcon from 'assets/images/logo-s.svg';
import styles from './index.scss';
import { MANAGE_WALLET_VIEW } from '../routes';

interface IWalletsView {
  onChange: (id: string) => void;
}

const WalletsView: FC<IWalletsView> = ({ onChange }) => {
  const controller = useController();
  const showView = useSettingsView();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const privKeyAccounts = Object.values(accounts).filter(
    (account) => account.type === AccountType.PrivKey
  );

  const handleSwitchWallet = async (id: string) => {
    await controller.wallet.switchWallet(id);
    controller.wallet.account.watchMemPool();
  };

  const handleManageWallet = (
    ev: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    ev.stopPropagation();
    onChange(id);
    showView(MANAGE_WALLET_VIEW);
  };

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
              onClick={() => handleSwitchWallet(account.id)}
            >
              {account.id === activeAccountId && (
                <CheckIcon className={styles.check} />
              )}
              <Icon Component={StargazerIcon} />
              <span>
                {account.label}
                <small>Multi Chain Wallet</small>
              </span>
              <IconButton
                className={styles.details}
                onClick={(ev) => handleManageWallet(ev, account.id)}
              >
                <InfoIcon />
              </IconButton>
            </section>
          ))}
      </div>
      {!!privKeyAccounts.length && (
        <>
          <label>Private key wallets</label>
          <div className={styles.group}>
            {privKeyAccounts.map((account) => (
              <section
                className={styles.wallet}
                key={account.id}
                onClick={() => handleSwitchWallet(account.id)}
              >
                {account.id === activeAccountId && (
                  <CheckIcon className={styles.check} />
                )}
                <Icon Component={StargazerIcon} />
                <span>
                  {account.label}
                  <small>Private Key Wallet</small>
                </span>
                <IconButton
                  className={styles.details}
                  onClick={(ev) => handleManageWallet(ev, account.id)}
                >
                  <InfoIcon />
                </IconButton>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WalletsView;
