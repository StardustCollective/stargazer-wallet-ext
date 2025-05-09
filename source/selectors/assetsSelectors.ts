import { createSelector } from '@reduxjs/toolkit';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

/**
 * Returns all assets
 */

const getAssets = (state: RootState): IAssetListState => state.assets;

/**
 * Returns an asset by address
 */

const getAssetByAddress = (address: string) => {
  return createSelector(getAssets, (assets) => {
    return Object.values(assets).find((asset) => asset.address === address) ?? null;
  });
};

/**
 * Returns an asset by address
 */

const getAssetBySymbol = (symbol: string) => {
  return createSelector(getAssets, (assets) => {
    return Object.values(assets).find((asset) => asset.symbol === symbol) ?? null;
  });
};

export default {
  getAssets,
  getAssetByAddress,
  getAssetBySymbol,
};
