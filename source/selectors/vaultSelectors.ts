import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'state/store';
import { ActiveNetwork, AssetBalances } from 'state/vault/types';

import { ALL_EVM_CHAINS, DAG_NETWORK } from '../constants';
import { StargazerChain } from '../scripts/common';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getActiveNetwork = (state: RootState): ActiveNetwork => state.vault.activeNetwork;
const getCurrentEvmNetwork = (state: RootState): string => state.vault.currentEVMNetwork;

/**
 * Returns the balance of a specific asset
 */
const getAssetBalance = (assetId: string) => {
  return createSelector(getBalances, balances => {
    return balances[assetId] ?? '-';
  });
};

/**
 * Returns the active constellation network
 */
const selectActiveConstellationNetwork = createSelector(getActiveNetwork, (activeNetwork: ActiveNetwork) => {
  return DAG_NETWORK[activeNetwork.Constellation] ?? null;
});

/**
 * Returns the active evm network
 */

const selectActiveEvmNetwork = createSelector(getCurrentEvmNetwork, (currentEvmNetwork: string) => {
  return ALL_EVM_CHAINS[currentEvmNetwork] ?? null;
});

/**
 * Returns the active evm network
 */
const selectActiveNetworkByChain = (chain: StargazerChain) => {
  return createSelector(getActiveNetwork, (activeNetwork: ActiveNetwork) => {
    // Capitalize the first letter of the chain -> StargazeChain to ActiveNetwork
    const network = (chain.charAt(0).toUpperCase() + chain.slice(1)) as keyof ActiveNetwork;
    const activeChain = activeNetwork[network] ?? null;

    return Object.values(ALL_EVM_CHAINS).find(net => net.id === activeChain) ?? null;
  });
};

export default {
  getCurrentEvmNetwork,
  getAssetBalance,
  getActiveNetwork,
  selectActiveNetworkByChain,
  selectActiveConstellationNetwork,
  selectActiveEvmNetwork,
};
