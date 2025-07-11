import { createSelector } from '@reduxjs/toolkit';

import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

import walletsSelectors from './walletsSelectors';

/**
 * Returns all assets
 */

const getAssets = (state: RootState): IAssetListState => state.assets;

/**
 * Returns an asset by address
 */

const getAssetByAddress = (address: string) => {
  return createSelector(getAssets, assets => {
    if (!address) return null;
    return Object.values(assets).find(asset => asset.address.toLowerCase() === address.toLowerCase()) ?? null;
  });
};

/**
 * Returns an asset by symbol
 */

const getAssetBySymbol = (symbol: string) => {
  return createSelector(getAssets, assets => {
    if (!symbol) return null;
    return Object.values(assets).find(asset => asset.symbol.toLowerCase() === symbol.toLowerCase()) ?? null;
  });
};

/**
 * Returns an asset by id
 */

const getAssetById = (id: string) => {
  return createSelector(getAssets, assets => {
    if (!id) return null;
    return Object.values(assets).find(asset => asset.id.toLowerCase() === id.toLowerCase()) ?? null;
  });
};

/**
 * Returns an asset by id
 */

const getMetagraphAsset = (address: string) => {
  return createSelector(getAssets, walletsSelectors.getActiveNetwork, (assets, activeNetwork) => {
    if (!address) return null;
    return Object.values(assets).find(asset => asset.address.toLowerCase() === address.toLowerCase() && activeNetwork.Constellation === asset.network) ?? null;
  });
};

export default {
  getAssets,
  getAssetByAddress,
  getAssetBySymbol,
  getAssetById,
  getMetagraphAsset,
};
