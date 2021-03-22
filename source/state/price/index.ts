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
      action.payload.forEach(({ id, price, priceChange }) => {
        if (!id) return;
        state.fiat = {
          ...state.fiat,
          [id]: {
            price,
            priceChange,
          },
        };
      });
    },
  },
});

export const { updateFiatPrice, updateFiatPrices } = PriceState.actions;

export default PriceState.reducer;
