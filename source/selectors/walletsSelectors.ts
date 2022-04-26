/**
 * Handles derived data for wallets state.
 */

/// //////////////////////
// Modules
/// //////////////////////
import { RootState } from 'state/store';
import { createSelector } from 'reselect';
import { KeyringNetwork, KeyringWalletState, KeyringAssetInfo, KeyringAccountState } from '@stardust-collective/dag4-keyring';

/// //////////////////////
// Types
/// //////////////////////
import { IAccountDerived, IVaultWalletsStoreState, IWalletState, AssetType, IAssetState, ActiveNetwork } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { getNfts } from './nftSelectors';

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


const selectLocalWallets = createSelector(getWallets,
  (wallets: IVaultWalletsStoreState) => wallets.local
);

/**
 * Returns ledger wallets.
 */

 const selectLedgerWallets = createSelector(getWallets,
  (wallets: IVaultWalletsStoreState) => wallets.ledger
);


/**
 * Returns all wallets.
 */

 const selectAllWallets = createSelector(
  selectLocalWallets,
  selectLedgerWallets,
  (localWallet, ledgerWallet) => {
    return [...localWallet, ...ledgerWallet];
  }
);

/**
 * Returns all accounts from all wallets.
 */

const selectAllAccounts = createSelector(selectAllWallets, (wallets: KeyringWalletState[]) => {
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
});

/**
 * Return wallet of active asset
 */

const selectActiveAssetPublicKey = createSelector(selectAllWallets, getActiveAsset, (wallets: KeyringWalletState[], activeAsset: KeyringAccountState) => {
  for (let i = 0; i < wallets.length; i++) {
    const { accounts } = wallets[i];
    for (let j = 0; j < wallets[i].accounts.length; j++) {
      let account = accounts[j];
      if(activeAsset.address === account.address){
        return account!.publicKey;
      }
    }
  }
  return '';
});

/**
 * Returns all DAG accounts from all wallets.
 */
const selectAllDagAccounts = createSelector(selectAllAccounts, (allAccounts) => {
  return allAccounts.filter((account) => account.network === KeyringNetwork.Constellation);
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
  (activeWallet: IWalletState, activeNetwork: ActiveNetwork, assets: KeyringAssetInfo[]): IAssetState[] => {
    if (!activeWallet?.assets) {
      return [];
    }

    return activeWallet.assets.filter((asset: IAssetState) => {
      const assetType = asset.type === AssetType.Constellation ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum;
      const assetNetwork = assets[asset.id as any]?.network;

      return assetNetwork === 'both' || assetNetwork === activeNetwork[assetType];
    });
  }
);

/**
 * Returns NFT assets
 * NFTs are fetched for the active network only so no activeNetwork checks are needed
 */
const selectNFTAssets = createSelector(
  getActiveWallet,
  getNfts,
  (activeWallet: IWalletState, nfts: INFTListState[]): IAssetState[] => {
    if (!activeWallet?.assets) {
      return [];
    }

    return activeWallet.assets.filter((asset: IAssetState) => {
      return asset.type === AssetType.ERC721 && nfts[asset.id as any];
    });
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
  selectNFTAssets,
  selectActiveAssetPublicKey
};
