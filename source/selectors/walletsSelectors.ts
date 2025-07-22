/**
 * Handles derived data for wallets state.
 */

import { createSelector } from '@reduxjs/toolkit';
import { KeyringNetwork, KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';

import { getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';

import { RootState } from 'state/store';
import { AssetType, IAccountDerived, IAssetState, IVaultWalletsStoreState } from 'state/vault/types';

const getActiveAsset = (state: RootState) => state.vault.activeAsset;

const getWallets = (state: RootState) => state.vault.wallets;

const getActiveWallet = (state: RootState) => state.vault.activeWallet;

const getActiveNetwork = (state: RootState) => state.vault.activeNetwork;

const getAssets = (state: RootState) => state.assets;

const selectLocalWallets = createSelector(getWallets, wallets => wallets.local);

const selectLedgerWallets = createSelector(getWallets, (wallets: IVaultWalletsStoreState) => wallets.ledger);

const selectBitfiWallets = createSelector(getWallets, (wallets: IVaultWalletsStoreState) => wallets.bitfi);

const selectCypherockWallets = createSelector(getWallets, (wallets: IVaultWalletsStoreState) => wallets.cypherock);

const selectMultiChainWallets = createSelector(selectLocalWallets, localWallets => {
  const localWalletsArray = localWallets || [];
  return localWalletsArray.filter(wallet => wallet.type === KeyringWalletType.MultiChainWallet);
});

const selectSingleAccountWallets = createSelector(selectLocalWallets, localWallets => {
  const localWalletsArray = localWallets || [];
  return localWalletsArray.filter(wallet => wallet.type === KeyringWalletType.SingleAccountWallet);
});

const selectAllHardwareWallets = createSelector(selectLedgerWallets, selectBitfiWallets, selectCypherockWallets, (ledgerWallets, bitfiWallets, cypherockWallets) => {
  const ledgerWalletsArray = ledgerWallets || [];
  const bitfiWalletsArray = bitfiWallets || [];
  const cypherockWalletsArray = cypherockWallets || [];
  return [...ledgerWalletsArray, ...bitfiWalletsArray, ...cypherockWalletsArray];
});

const selectAllWallets = createSelector(selectLocalWallets, selectLedgerWallets, selectBitfiWallets, selectCypherockWallets, (localWallets, ledgerWallets, bitfiWallets, cypherockWallets) => {
  const localWalletsArray = localWallets || [];
  const ledgerWalletsArray = ledgerWallets || [];
  const bitfiWalletsArray = bitfiWallets || [];
  const cypherockWalletsArray = cypherockWallets || [];
  return [...localWalletsArray, ...ledgerWalletsArray, ...bitfiWalletsArray, ...cypherockWalletsArray];
});

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
 * Return the public key of the active asset
 */

const selectActiveAssetPublicKey = createSelector(getActiveWallet, getActiveAsset, (activeWallet, activeAsset) => {
  const isDagAsset = activeAsset?.type === AssetType.Constellation;
  for (let j = 0; j < activeWallet.accounts.length; j++) {
    const account = activeWallet.accounts[j];
    if (account.network === KeyringNetwork.Constellation && isDagAsset) {
      return account!.publicKey ?? null;
    }
    if (account.network === KeyringNetwork.Ethereum && !isDagAsset) {
      return account!.publicKey ?? null;
    }
  }
  return '';
});

/**
 * Return the deviceId of the active asset
 */

const selectActiveAssetDeviceId = createSelector(selectAllWallets, getActiveAsset, (wallets, activeAsset) => {
  for (let i = 0; i < wallets.length; i++) {
    const { accounts } = wallets[i];
    for (let j = 0; j < wallets[i].accounts.length; j++) {
      const account = accounts[j];
      if (activeAsset?.address === account.address) {
        return account!.deviceId ?? null;
      }
    }
  }
  return '';
});

/**
 * Return the cypherockId of the active wallet
 */

const selectActiveWalletCypherockId = createSelector(getActiveWallet, activeWallet => {
  return activeWallet?.cypherockId ?? null;
});

const selectActiveWalletDagAddress = createSelector(getActiveWallet, activeWallet => {
  return activeWallet?.accounts?.find(account => account?.network === KeyringNetwork.Constellation)?.address ?? null;
});

const selectActiveWalletEthAddress = createSelector(getActiveWallet, activeWallet => {
  return activeWallet?.accounts?.find(account => account?.network === KeyringNetwork.Ethereum)?.address ?? null;
});

/**
 * Return the deviceId of the active wallet
 */

const selectActiveWalletDeviceId = createSelector(getActiveWallet, activeWallet => {
  return activeWallet?.accounts?.length > 0 ? activeWallet.accounts[0].deviceId ?? null : null;
});

/**
 * Return the bipIndex of the active wallet
 */

const selectActiveWalletBipIndex = createSelector(getActiveWallet, activeWallet => {
  return activeWallet?.bipIndex ?? null;
});

/**
 * Returns all DAG accounts from all wallets.
 */
const selectAllDagAccounts = createSelector(selectAllAccounts, allAccounts => {
  return allAccounts.filter(account => account.network === KeyringNetwork.Constellation);
});

/**
 * Returns all ETH accounts from all wallets.
 */
const selectAllEthAccounts = createSelector(selectAllAccounts, allAccounts => {
  return allAccounts.filter(account => account.network === KeyringNetwork.Ethereum);
});

/**
 * Returns known assets that belong to the currently active network
 * Does not return custom assets that are not part of token initialState
 */
const selectActiveNetworkAssets = createSelector(getActiveWallet, getActiveNetwork, getAssets, (activeWallet, activeNetwork, assets) => {
  if (!activeWallet?.assets) {
    return [];
  }

  return activeWallet.assets.filter((asset: IAssetState) => {
    const assetInfo = assets[asset.id];
    const assetNetwork = assetInfo?.network;
    const assetId = assetInfo?.id;
    const assetNetworkType: string = asset.type === AssetType.Constellation ? KeyringNetwork.Constellation : getNetworkFromChainId(assetNetwork);
    // 349: New network should be added here.
    const isDAG = assetId === AssetType.Constellation && assetNetwork === 'both';
    const isETH = assetId === AssetType.Ethereum && assetNetwork === 'both';
    const isMATIC = assetId === AssetType.Polygon && assetNetwork === 'matic';
    const isAVAX = assetId === AssetType.Avalanche && assetNetwork === 'avalanche-mainnet';
    const isBNB = assetId === AssetType.BSC && assetNetwork === 'bsc';
    const isBase = assetId === AssetType.Base && assetNetwork === 'base-mainnet';
    return isDAG || isETH || isMATIC || isAVAX || isBNB || isBase || assetNetwork === activeNetwork[assetNetworkType as keyof typeof activeNetwork];
  });
});

const selectActiveNetworkAssetIds = createSelector(selectActiveNetworkAssets, assets => {
  return assets.map(asset => asset.id);
});

export default {
  getAssets,
  getActiveAsset,
  getActiveWallet,
  getActiveNetwork,
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
  selectAllWallets,
  selectAllHardwareWallets,
  selectMultiChainWallets,
  selectSingleAccountWallets,
  selectActiveNetworkAssets,
  selectActiveNetworkAssetIds,
  selectActiveAssetPublicKey,
  selectActiveAssetDeviceId,
  selectActiveWalletCypherockId,
  selectActiveWalletDeviceId,
  selectActiveWalletBipIndex,
  selectActiveWalletDagAddress,
  selectActiveWalletEthAddress,
};
