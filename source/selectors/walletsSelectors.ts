/**
 * Handles derived data for wallets state.
 */

/// //////////////////////
// Modules
/// //////////////////////

import { RootState } from 'state/store';
import { createSelector } from 'reselect';
import { KeyringNetwork, KeyringWalletState, KeyringAssetInfo } from '@stardust-collective/dag4-keyring';

/// //////////////////////
// Types
/// //////////////////////

import { IAccountDerived, IWalletState, AssetType, IAssetState, ActiveNetwork } from 'state/vault/types';

/// //////////////////////
// Selectors
/// //////////////////////

/**
 * Returns root wallets state
 */
const getWallets = (state: RootState) => state.vault.wallets;

/**
 * Returns activeWallet state
 */
const getActiveWallet = (state: RootState) => state.vault.activeWallet;

/**
 * Returns activeNetwork state
 */
const getActiveNetwork = (state: RootState) => state.vault.activeNetwork;

/**
 * Returns assets
 */
const getAssets = (state: RootState) => state.assets;

/**
 * Returns all accounts from all wallets.
 */

const selectAllAccounts = createSelector(getWallets, (wallets: KeyringWalletState[]) => {
  const allAccounts = [];
  for (let i = 0; i < wallets.length; i++) {
    const { accounts } = wallets[i];
    for (let j = 0; j < wallets[i].accounts.length; j++) {
      const account = accounts[j] as IAccountDerived;
      account.label = wallets[i].label;
      allAccounts.push(account);
    }
  }
  return allAccounts;
});

/**
 * Returns all DAG accounts from all wallets.
 */
const selectAllDagAccounts = createSelector(selectAllAccounts, (allAccounts: IAccountDerived[]) => {
  return allAccounts.filter((account) => account.network === KeyringNetwork.Constellation);
});

/**
 * Returns all ETH accounts from all wallets.
 */
const selectAllEthAccounts = createSelector(selectAllAccounts, (allAccounts: IAccountDerived[]) => {
  return allAccounts.filter((account) => account.network === KeyringNetwork.Ethereum);
});

const selectAllWallets = createSelector(getWallets, (wallets: KeyringWalletState[]) => {
  return [...wallets];
});

const selectActiveNetworkAssets = createSelector(
  getActiveWallet,
  getActiveNetwork,
  getAssets,
  (activeWallet: IWalletState, activeNetwork: ActiveNetwork, assets: KeyringAssetInfo[]): IAssetState[] => {
    if (!activeWallet?.assets) {
      console.log('no activeWallet.assets: ', activeWallet);
      return [];
    }

    return activeWallet.assets.filter(
      (asset: IAssetState) =>
        assets[asset.id as any]?.network === 'both' ||
        assets[asset.id as any]?.network ===
          activeNetwork[asset.type === AssetType.Constellation ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum]
    );
  }
);

const selectActiveNetworkAssetIds = createSelector(selectActiveNetworkAssets, (assets: IAssetState[]): string[] => {
  return assets.map((asset) => asset.id);
});

export default {
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
  selectAllWallets,
  selectActiveNetworkAssets,
  selectActiveNetworkAssetIds,
};
