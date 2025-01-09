import { createSelector } from '@reduxjs/toolkit';
import { IFiatState } from 'state/price/types';
import { RootState } from 'state/store';

const getFiatPrice = (state: RootState): IFiatState => state.price.fiat;

/**
 * Returns the price of a specific asset
 */
const getAssetPrice = (priceId: string) => {
  return createSelector(getFiatPrice, (fiat) => {
    return fiat[priceId] ?? null;
  });
};

export default {
  getAssetPrice,
};
