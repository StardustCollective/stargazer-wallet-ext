import React, { FC, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import Icon from 'components/Icon';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IWalletState } from 'state/vault/types';
import { useController, useSettingsView } from 'hooks/index';

import StargazerIcon from 'assets/images/logo-s.svg';
import { MANAGE_WALLET_VIEW } from '../routes';
import styles from './index.scss';
import IAssetListState from 'state/assets/types';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';

interface IWalletsView {
  onChange: (id: string) => void;
}

const WalletsView: FC<IWalletsView> = ({ onChange }) => {
  const controller = useController();
  const showView = useSettingsView();
  const { wallets, activeWallet:activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  const privKeyAccounts = wallets.filter(
    (w) => w.type === KeyringWalletType.SimpleAccountWallet
  );

  const handleSwitchWallet = async (wallet: IWalletState) => {
    await controller.wallet.switchWallet(wallet);
    //controller.wallet.account.watchMemPool();
  };

  const handleManageWallet = (
    ev: MouseEvent<HTMLButtonElement>,
    wallet: IWalletState
  ) => {
    ev.stopPropagation();
    controller.wallet.switchWallet(wallet);
    onChange(wallet.id);
    showView(MANAGE_WALLET_VIEW);
  };

  return (
    <div className={styles.wallets}>
      <label>Multi chain wallets</label>
      <div className={styles.group}>
        {wallets
          .filter((w) => w.type === KeyringWalletType.MultiChainWallet)
          .map((wallet) => (
            <section
              className={styles.wallet}
              key={wallet.id}
              onClick={() => handleSwitchWallet(wallet)}
            >
              {wallet === activeWallet && (
                <CheckIcon className={styles.check} />
              )}
              <Icon Component={StargazerIcon} />
              <span>
                {wallet.label}
                <small>Multi Chain Wallet</small>
              </span>
              <IconButton
                className={styles.details}
                onClick={(ev) => handleManageWallet(ev, wallet)}
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
            {privKeyAccounts.map((wallet) => (
              <section
                className={styles.wallet}
                key={wallet.id}
                onClick={() => handleSwitchWallet(wallet)}
              >
                {wallet === activeWallet && (
                  <CheckIcon className={styles.check} />
                )}
                <Icon
                  Component={
                    assets[
                      wallet.supportedAssets.includes(KeyringAssetType.ETH)
                        ? AssetType.Ethereum
                        : AssetType.Constellation
                    ].logo || StargazerIcon
                  }
                />
                <span>
                  {wallet.label}
                  <small>
                    { activeWallet.assets[0].address }
                  </small>
                </span>
                <IconButton
                  className={styles.details}
                  onClick={(ev) => handleManageWallet(ev, wallet)}
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
