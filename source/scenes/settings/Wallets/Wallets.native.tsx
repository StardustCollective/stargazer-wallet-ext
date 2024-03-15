import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import { ellipsis } from 'scenes/home/helpers';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import Menu from 'components/Menu';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';
import IWalletsSettings from './types';
import styles from './styles';

const ICON_SIZE = 36;

const WalletsComponent: FC<IWalletsSettings> = ({
  multiChainAccounts,
  privKeyAccounts,
  handleManageWallet,
}) => {
  const multiChainItems =
    !!multiChainAccounts.length &&
    multiChainAccounts.map((item) => ({
      title: item.label,
      subtitle: 'Multi-chain',
      onClick: handleManageWallet,
      data: item.id,
      icon: <StargazerIcon width={ICON_SIZE} height={ICON_SIZE} />,
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

  return (
    <ScrollView
      style={styles.wallets}
      contentContainerStyle={styles.walletsContentContainer}
    >
      {!!multiChainItems && <Menu title="Multi-Chain Wallets" items={multiChainItems} />}
      {!!privateKeyItems && <Menu title="Private Key Wallets" items={privateKeyItems} />}
    </ScrollView>
  );
};

export default WalletsComponent;
