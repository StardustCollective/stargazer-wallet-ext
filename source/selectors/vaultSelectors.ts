import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'state/store';
import { ActiveNetwork, AssetBalances, IActiveAssetState, IWalletState } from 'state/vault/types';

import { ALL_EVM_CHAINS, DAG_NETWORK } from '../constants';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getActiveAsset = (state: RootState): IActiveAssetState => state.vault.activeAsset;
const getActiveWallet = (state: RootState): IWalletState => state.vault.activeWallet;
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
const selectActiveNetworkByChain = (network: keyof ActiveNetwork) => {
  return createSelector(getActiveNetwork, (activeNetwork: ActiveNetwork) => {
    const activeChain = activeNetwork[network] ?? null;

    return Object.values(ALL_EVM_CHAINS).find(net => net.id === activeChain) ?? null;
  });
};

export default {
  getBalances,
  getCurrentEvmNetwork,
  getAssetBalance,
  getActiveAsset,
  getActiveWallet,
  getActiveNetwork,
  selectActiveNetworkByChain,
  selectActiveConstellationNetwork,
  selectActiveEvmNetwork,
};
