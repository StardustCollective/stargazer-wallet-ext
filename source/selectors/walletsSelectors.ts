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
} from 'state/vault/types';
import { getNfts } from './nftSelectors';
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
    return [...localWallets, ...ledgerWallets, ...bitfiWallets];
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
 * Return wallet of active asset
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
      // TODO-349: Check if this logic works for all networks
      const assetInfo = assets[asset.id];
      const assetNetwork = assetInfo?.network;
      let assetNetworkType: string = asset.type === AssetType.Constellation ? KeyringNetwork.Constellation : getNetworkFromChainId(assetNetwork);
              
      return ['both', 'matic', 'avalanche-mainnet', 'bsc'].includes(assetNetwork) || assetNetwork === activeNetwork[assetNetworkType as keyof typeof activeNetwork];
    });
  }
);

/**
 * Returns NFT assets
 * NFTs are fetched for the active network only so no activeNetwork checks are needed
 */
const selectNFTAssets = createSelector(getActiveWallet, getNfts, (activeWallet, nfts) => {
  if (!activeWallet?.assets) {
    return [];
  }

  return activeWallet.assets.filter((asset: IAssetState) => {
    return asset.type === AssetType.ERC721 && nfts[asset.id as any];
  });
});

const selectActiveNetworkAssetIds = createSelector(
  selectActiveNetworkAssets,
  (assets) => {
    return assets.map((asset) => asset.id);
  }
);

export default {
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
  selectAllWallets,
  selectActiveNetworkAssets,
  selectActiveNetworkAssetIds,
  selectNFTAssets,
  selectActiveAssetPublicKey,
};
