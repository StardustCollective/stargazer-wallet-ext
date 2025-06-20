import { createSelector } from '@reduxjs/toolkit';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { RootState } from 'state/store';
import { ActiveNetwork, AssetBalances, Network } from 'state/vault/types';

import { ALL_EVM_CHAINS, DAG_NETWORK } from '../constants';

const getBalances = (state: RootState): AssetBalances => state.vault.balances;
const getActiveNetwork = (state: RootState): ActiveNetwork => state.vault.activeNetwork;
const getCurrentEvmNetwork = (state: RootState): string => state.vault.currentEVMNetwork;

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
  return createSelector(getBalances, balances => {
    return balances[assetId] ?? '-';
  });
};

/**
 * Returns the label of the constellation active network
 */

const selectConstellationNetworkLabel = createSelector(getActiveNetwork, (activeNetwork: ActiveNetwork) => {
  const networkId = activeNetwork[KeyringNetwork.Constellation];
  const { label, network, chainId } = DAG_NETWORK[networkId];
  const extraLabel = chainId !== 1 ? ` ${label}` : '';

  return `${network}${extraLabel}`;
});

/**
 * Returns the label of the evm active network
 */

const selectActiveEvmNetworkLabel = createSelector(getCurrentEvmNetwork, (currentEvmNetwork: string) => {
  return ALL_EVM_CHAINS[currentEvmNetwork]?.label ?? '';
});

export default {
  getCurrentEvmNetwork,
  getAssetBalance,
  getActiveNetwork,
  getActiveNetworkByChain,
  selectConstellationNetworkLabel,
  selectActiveEvmNetworkLabel,
};
