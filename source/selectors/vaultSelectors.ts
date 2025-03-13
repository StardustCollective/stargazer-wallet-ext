import { createSelector } from '@reduxjs/toolkit';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { RootState } from 'state/store';
import { ActiveNetwork, AssetBalances, Network } from 'state/vault/types';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getActiveNetwork = (state: RootState): ActiveNetwork => state.vault.activeNetwork;

/**
 * Returns the active network for a given chain
 */
const getActiveNetworkByChain = (chain: KeyringNetwork | Network) => {
  return createSelector(getActiveNetwork, (activeNetwork: ActiveNetwork) => {
    return activeNetwork[chain] ?? null;
  });
};

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
  getActiveNetworkByChain,
};
