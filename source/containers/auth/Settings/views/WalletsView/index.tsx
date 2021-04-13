import React, { FC, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import Icon from 'components/Icon';
import { RootState } from 'state/store';
import IWalletState, { AccountType, AssetType } from 'state/wallet/types';
import { useController, useSettingsView } from 'hooks/index';

import StargazerIcon from 'assets/images/logo-s.svg';
import { MANAGE_WALLET_VIEW } from '../routes';
import { ETH_PREFIX } from 'constants/index';
import styles from './index.scss';
import IAssetListState from 'state/assets/types';

interface IWalletsView {
  onChange: (id: string) => void;
}

const WalletsView: FC<IWalletsView> = ({ onChange }) => {
  const controller = useController();
  const showView = useSettingsView();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
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
                <Icon
                  Component={
                    assets[
                      account.id.startsWith(ETH_PREFIX)
                        ? AssetType.Ethereum
                        : AssetType.Constellation
                    ].logo || StargazerIcon
                  }
                />
                <span>
                  {account.label}
                  <small>
                    {
                      account.assets[
                        account.id.startsWith(ETH_PREFIX)
                          ? AssetType.Ethereum
                          : AssetType.Constellation
                      ].address
                    }
                  </small>
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
