import React, { FC } from 'react';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import LockIcon from 'assets/images/svg/lock-icon.svg';
import IWalletSettings from './types';
import { ellipsis } from 'scenes/home/helpers';
import styles from './Wallets.scss';
import Menu from 'components/Menu';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';

const WalletsComponent: FC<IWalletSettings> = ({
  multiChainAccounts,
  privKeyAccounts,
  hardwareWalletAccounts,
  handleManageWallet,
}) => {
  const multiChainItems =
    !!multiChainAccounts.length &&
    multiChainAccounts.map((item) => ({
      title: item.label,
      subtitle: 'Multi-chain',
      onClick: handleManageWallet,
      data: item.id,
      icon: StargazerIcon,
    }));

  const privateKeyItems =
    !!privKeyAccounts.length &&
    privKeyAccounts.map((item) => ({
      title: item.label,
      subtitle: ellipsis(item.accounts[0].address),
      onClick: handleManageWallet,
      data: item.id,
      icon: item.supportedAssets.includes(KeyringAssetType.ETH)
        ? ETHEREUM_LOGO
        : CONSTELLATION_LOGO,
    }));

  const hardwareWalletsItems =
    !!hardwareWalletAccounts.length &&
    hardwareWalletAccounts.map((item) => ({
      title: item.label,
      subtitle: ellipsis(item.accounts[0].address),
      onClick: handleManageWallet,
      data: item.id,
      icon: LockIcon,
    }));

  return (
    <div className={styles.wallets}>
      {!!multiChainItems && <Menu title="Multi-Chain Wallets" items={multiChainItems} />}
      {!!privateKeyItems && <Menu title="Private Key Wallets" items={privateKeyItems} />}
      {!!hardwareWalletsItems && (
        <Menu title="Hardware Wallets" items={hardwareWalletsItems} />
      )}
    </div>
  );
};

export default WalletsComponent;
