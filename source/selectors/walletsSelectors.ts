/**
 * Handles derived data for wallets state.
 */

/// //////////////////////
// Modules
/// //////////////////////
import { RootState } from 'state/store';
import { createSelector } from '@reduxjs/toolkit';
import { KeyringNetwork, KeyringWalletState } from '@stardust-collective/dag4-keyring';

/// //////////////////////
// Types
/// //////////////////////
import {
  IAccountDerived,
  AssetType,
  IAssetState,
  IVaultWalletsStoreState,
  AssetSymbol,
} from 'state/vault/types';
import { getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';

/// //////////////////////
// Selectors
/// //////////////////////

/**
 * Returns the active asset
 */
const getActiveAsset = (state: RootState) => state.vault.activeAsset;

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

const selectLocalWallets = createSelector(getWallets, (wallets) => wallets.local);

/**
 * Returns ledger wallets.
 */

const selectLedgerWallets = createSelector(
  getWallets,
  (wallets: IVaultWalletsStoreState) => wallets.ledger
);

/**
 * Returns Bitfi wallets.
 */

const selectBitfiWallets = createSelector(
  getWallets,
  (wallets: IVaultWalletsStoreState) => wallets.bitfi
);

/**
 * Returns all wallets.
 */

const selectAllWallets = createSelector(
  selectLocalWallets,
  selectLedgerWallets,
  selectBitfiWallets,
  (localWallets, ledgerWallets, bitfiWallets) => {
    const localWalletsArray = !!localWallets ? localWallets : [];
    const ledgerWalletsArray = !!ledgerWallets ? ledgerWallets : [];
    const bitfiWalletsArray = !!bitfiWallets ? bitfiWallets : [];
    return [...localWalletsArray, ...ledgerWalletsArray, ...bitfiWalletsArray];
  }
);

/**
 * Returns all accounts from all wallets.
 */

const selectAllAccounts = createSelector(
  selectAllWallets,
  (wallets: KeyringWalletState[]) => {
    const allAccounts = [];
    for (let i = 0; i < wallets.length; i++) {
      const { accounts } = wallets[i];
      for (let j = 0; j < wallets[i].accounts.length; j++) {
        const account = accounts[j] as any as IAccountDerived;
        account.label = wallets[i].label;
        allAccounts.push(account);
      }
    }
    return allAccounts;
  }
);

/**
 * Return the public key of the active asset
 */

const selectActiveAssetPublicKey = createSelector(
  selectAllWallets,
  getActiveAsset,
  (wallets, activeAsset) => {
    for (let i = 0; i < wallets.length; i++) {
      const { accounts } = wallets[i];
      for (let j = 0; j < wallets[i].accounts.length; j++) {
        let account = accounts[j];
        if (activeAsset?.address === account.address) {
          return account!.publicKey ?? null;
        }
      }
    }
    return '';
  }
);

/**
 * Return the deviceId of the active asset
 */

const selectActiveAssetDeviceId = createSelector(
  selectAllWallets,
  getActiveAsset,
  (wallets, activeAsset) => {
    for (let i = 0; i < wallets.length; i++) {
      const { accounts } = wallets[i];
      for (let j = 0; j < wallets[i].accounts.length; j++) {
        let account = accounts[j];
        if (activeAsset?.address === account.address) {
          return account!.deviceId ?? null;
        }
      }
    }
    return '';
  }
);

/**
 * Returns all DAG accounts from all wallets.
 */
const selectAllDagAccounts = createSelector(selectAllAccounts, (allAccounts) => {
  return allAccounts.filter(
    (account) => account.network === KeyringNetwork.Constellation
  );
});

/**
 * Returns all ETH accounts from all wallets.
 */
const selectAllEthAccounts = createSelector(selectAllAccounts, (allAccounts) => {
  return allAccounts.filter((account) => account.network === KeyringNetwork.Ethereum);
});

/**
 * Returns known assets that belong to the currently active network
 * Does not return custom assets that are not part of token initialState
 */
const selectActiveNetworkAssets = createSelector(
  getActiveWallet,
  getActiveNetwork,
  getAssets,
  (activeWallet, activeNetwork, assets) => {
    if (!activeWallet?.assets) {
      return [];
    }

    return activeWallet.assets.filter((asset: IAssetState) => {
      const assetInfo = assets[asset.id];
      const assetNetwork = assetInfo?.network;
      const assetSymbol = assetInfo?.symbol;
      let assetNetworkType: string =
        asset.type === AssetType.Constellation
          ? KeyringNetwork.Constellation
          : getNetworkFromChainId(assetNetwork);
      // 349: New network should be added here.
      const isDAG = assetSymbol === AssetSymbol.DAG && assetNetwork === 'both';
      const isETH = assetSymbol === AssetSymbol.ETH && assetNetwork === 'both';
      const isMATIC = assetSymbol === AssetSymbol.MATIC && assetNetwork === 'matic';
      const isAVAX =
        assetSymbol === AssetSymbol.AVAX && assetNetwork === 'avalanche-mainnet';
      const isBNB = assetSymbol === AssetSymbol.BNB && assetNetwork === 'bsc';
      return (
        isDAG ||
        isETH ||
        isMATIC ||
        isAVAX ||
        isBNB ||
        assetNetwork === activeNetwork[assetNetworkType as keyof typeof activeNetwork]
      );
    });
  }
);

const selectActiveNetworkAssetIds = createSelector(
  selectActiveNetworkAssets,
  (assets) => {
    return assets.map((asset) => asset.id);
  }
);

export default {
  getActiveAsset,
  getActiveWallet,
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
  selectAllWallets,
  selectActiveNetworkAssets,
  selectActiveNetworkAssetIds,
  selectActiveAssetPublicKey,
  selectActiveAssetDeviceId,
};
