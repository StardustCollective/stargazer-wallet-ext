import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IPriceState from './types';

const initialState: IPriceState = {
  fiat: {},
  currency: {
    id: 'usd',
    symbol: '$',
    name: 'USD',
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const PriceState = createSlice({
  name: 'price',
  initialState,
  reducers: {
    rehydrate(
      state: IPriceState,
      action: PayloadAction<{
        assetId: string;
        price: number;
        priceChange: number;
      }>
    ) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateFiatPrice(
      state: IPriceState,
      action: PayloadAction<{
        assetId: string;
        price: number;
        priceChange: number;
      }>
    ) {
      state.fiat = {
        ...state.fiat,
        [action.payload.assetId]: {
          price: action.payload.price,
          priceChange: action.payload.priceChange,
        },
      };
    },
    updateFiatPrices(
      state: IPriceState,
      action: PayloadAction<
        {
          id: string;
          price: number;
          priceChange: number;
        }[]
      >
    ) {
      const fiat: any = {};
      action.payload.forEach(({ id, price, priceChange }) => {
        if (id) fiat[id] = { price, priceChange };
      });
      state.fiat = fiat;
    },
  },
});

export const { updateFiatPrice, updateFiatPrices, rehydrate } = PriceState.actions;

export default PriceState.reducer;
