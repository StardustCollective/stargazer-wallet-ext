import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrencyData } from './api';
import ISwappingState, { ISelectedCurrency } from './types';


export const initialState: ISwappingState = {
  currencyData: null,
  loading: false,
  error: null,
  swapFrom: {
    currency: {
      code: null,
      name: null,
      icon: null,
      notes: null,
      networks: null,
    },
    network: null,
  },
  swapTo: {
    currency: {
      code: null,
      name: null,
      icon: null,
      notes: null,
      networks: null,
    },
    network: null,
  },
};

const SwappingState = createSlice({
  name: 'swapping',
  initialState,
  reducers: {
    setSwapFrom(state: ISwappingState, action: PayloadAction<ISelectedCurrency>) {
      state.swapFrom.currency = action.payload.currency;
      state.swapFrom.network = action.payload.network;
    },
    setSwapTo(state: ISwappingState, action: PayloadAction<ISelectedCurrency>) {
      state.swapTo.currency = action.payload.currency;
      state.swapTo.network = action.payload.network;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrencyData.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currencyData = null;
    });
    builder.addCase(getCurrencyData.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.currencyData = action.payload.data;
    });
    builder.addCase(getCurrencyData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currencyData = null;
    });
  }
});

export const { setSwapFrom, setSwapTo } = SwappingState.actions;

export default SwappingState.reducer;
