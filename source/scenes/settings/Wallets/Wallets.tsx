import React, { FC } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';

import Icon from 'components/Icon';

import { IAccountDerived, AssetType } from 'state/vault/types';

import StargazerIcon from 'assets/images/logo-s.svg';

import IWalletSettings from './types';

import styles from './Wallets.scss';

const WalletsComponent: FC<IWalletSettings> = ({
  wallets,
  activeWallet,
  assets,
  privKeyAccounts,
  handleSwitchWallet,
  handleManageWallet,
}) => {
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
              onClick={() => handleSwitchWallet(wallet.id, wallet.accounts as IAccountDerived[])}
            >
              {wallet.id === activeWallet.id && <CheckIcon className={styles.check} />}
              <Icon width={25} Component={StargazerIcon} iconStyles={styles.icon} />
              <span id={wallet.label}>
                {wallet.label}
                <small>Multi Chain Wallet</small>
              </span>
              <IconButton className={styles.details} onClick={(ev) => handleManageWallet(ev, wallet.id)}>
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
                onClick={() => handleSwitchWallet(wallet.id, wallet.accounts as IAccountDerived[])}
              >
                {wallet.id === activeWallet.id && <CheckIcon className={styles.check} />}
                <Icon
                  width={24}
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
                  <small>{wallet.accounts[0].address}</small>
                </span>
                <IconButton className={styles.details} onClick={(ev) => handleManageWallet(ev, wallet.id)}>
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

export default WalletsComponent;
