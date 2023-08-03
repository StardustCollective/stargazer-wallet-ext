import React, { FC } from 'react';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import Icon from 'components/Icon';
import { AssetType } from 'state/vault/types';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import LockIcon from 'assets/images/svg/lock-icon.svg';
import ChevronRight from 'assets/images/svg/arrow-rounded-right.svg';
import IWalletSettings from './types';
import { ellipsis, truncateString } from 'scenes/home/helpers';
import styles from './Wallets.scss';

const WalletsComponent: FC<IWalletSettings> = ({
  wallets,
  privKeyAccounts,
  hardwareWalletAccounts,
  assets,
  handleManageWallet,
}) => {
  return (
    <div className={styles.wallets}>
      {!!wallets.length && (
        <>
          <label>Multi Chain Wallets</label>
          <div className={styles.group}>
            {wallets
              .filter((w) => w.type === KeyringWalletType.MultiChainWallet)
              .map((wallet) => (
                <section
                  className={styles.wallet}
                  key={wallet.id}
                  onClick={() => handleManageWallet(wallet.id)}
                >
                  <Icon width={40} Component={StargazerIcon} />
                  <span id={wallet.label}>
                    {truncateString(wallet.label)}
                    <small>Multi Chain Wallet</small>
                  </span>
                  <img src={`/${ChevronRight}`} height={14} width={14} />
                </section>
              ))}
          </div>
        </>
      )}
      {!!privKeyAccounts.length && (
        <div className={styles.section}>
          <label>Private Key Wallets</label>
          <div className={styles.group}>
            {privKeyAccounts.map((wallet) => (
              <section
                className={styles.wallet}
                key={wallet.id}
                onClick={() => handleManageWallet(wallet.id)}
              >
                {
                  <div className={styles.walletIcon}>
                    <img
                      src={`${
                        assets[
                          wallet.supportedAssets.includes(KeyringAssetType.ETH)
                            ? AssetType.Ethereum
                            : AssetType.Constellation
                        ].logo
                      }`}
                      width={24}
                    />
                  </div>
                }
                <span>
                  {truncateString(wallet.label)}
                  <small>{ellipsis(wallet.accounts[0].address)}</small>
                </span>
                <img src={`/${ChevronRight}`} height={14} width={14} />
              </section>
            ))}
          </div>
        </div>
      )}
      {!!hardwareWalletAccounts.length && (
        <div className={styles.section}>
          <label>Hardware Wallets</label>
          <div className={styles.group}>
            {hardwareWalletAccounts.map((wallet) => (
              <section
                className={styles.wallet}
                key={wallet.id}
                onClick={() => handleManageWallet(wallet.id)}
              >
                <Icon width={40} Component={LockIcon} />
                <span>
                  {truncateString(wallet.label)}
                  <small>{ellipsis(wallet.accounts[0].address)}</small>
                </span>
                <img src={`/${ChevronRight}`} height={14} width={14} />
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsComponent;
