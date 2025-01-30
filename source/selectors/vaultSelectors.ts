import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { AssetBalances, IVaultWalletsStoreState } from 'state/vault/types';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getWallets = (state: RootState): IVaultWalletsStoreState => state.vault.wallets;
const getHasEncryptedVault = (state: RootState): boolean => state.vault.hasEncryptedVault;
const getMigrateWallet = (state: RootState): any => state.vault.migrateWallet;

/**
 * Returns the balance of a specific asset
 */
const getAssetBalance = (assetId: string) => {
  return createSelector(getBalances, (balances) => {
    return balances[assetId] ?? '-';
  });
};

/**
 * Returns if the user is authorized
 */

const isAuthorized = () => {
  return createSelector(
    getWallets,
    getHasEncryptedVault,
    getMigrateWallet,
    (wallets, hasEncryptedVault, migrateWallet) => {
      return (
        migrateWallet ||
        (wallets.local && Object.values(wallets.local).length > 0) ||
        hasEncryptedVault
      );
    }
  );
};

export default {
  isAuthorized,
  getAssetBalance,
};
