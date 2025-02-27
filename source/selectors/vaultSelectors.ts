import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { ActiveNetwork, AssetBalances } from 'state/vault/types';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getActiveNetwork = (state: RootState): ActiveNetwork => state.vault.activeNetwork;

/**
 * Returns the balance of a specific asset
 */
const getAssetBalance = (assetId: string) => {
  return createSelector(getBalances, (balances) => {
    return balances[assetId] ?? '-';
  });
};

export default {
  getAssetBalance,
  getActiveNetwork,
};
