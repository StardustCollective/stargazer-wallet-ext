import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrencyData, getSupportedAssets, getCurrencyRate, stageTransaction } from './api';
import ISwapState, { ISelectedCurrency } from './types';

export const initialState: ISwapState = {
  currencyData: null,
  loading: false,
  error: null,
  swapFrom: {
    currency: {
      id: null,
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
  supportedAssets: null,
  currencyRate: {
    rate: null,
    loading: false,
  },
  pendingSwap: null,
  txIds: [],
};

const SwappingState = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    rehydrate(state: ISwapState, action: PayloadAction<ISwapState>) {
      // txIds is the only key/values that are presisted for the swap state.
      return {
        ...state,
        txIds: [
          ...state.txIds,
          ...action.payload.txIds,
        ],
      };
    },
    setSwapFrom(state: ISwapState, action: PayloadAction<ISelectedCurrency>) {
      state.swapFrom.currency = action.payload.currency;
      state.swapFrom.network = action.payload.network;
    },
    setSwapTo(state: ISwapState, action: PayloadAction<ISelectedCurrency>) {
      state.swapTo.currency = action.payload.currency;
      state.swapTo.network = action.payload.network;
    },
    addTxId(state: ISwapState, action: PayloadAction<string>) {
      state.txIds = [
        ...state.txIds,
        action.payload,
      ];
    },
    clearPendingSwap(state: ISwapState) {
      state.pendingSwap = null;
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
    builder.addCase(getSupportedAssets.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.supportedAssets = null;
    });
    builder.addCase(getSupportedAssets.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.supportedAssets = action.payload;
    });
    builder.addCase(getSupportedAssets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.supportedAssets = null;
    });
    builder.addCase(getCurrencyRate.pending, (state) => {
      state.currencyRate.loading = true;
      state.error = null;
      state.currencyRate.rate = null;
    });
    builder.addCase(getCurrencyRate.fulfilled, (state, action) => {
      state.currencyRate.loading = false;
      state.error = null;
      state.currencyRate.rate = action.payload;
    });
    builder.addCase(getCurrencyRate.rejected, (state, action) => {
      state.currencyRate.loading = false;
      state.error = action.payload;
      state.currencyRate.rate = null;
    });
    builder.addCase(stageTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.pendingSwap = null;
    });
    builder.addCase(stageTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.pendingSwap = action.payload;
    });
    builder.addCase(stageTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.pendingSwap = null;
    });
  }
});

export const { setSwapFrom, setSwapTo, clearPendingSwap, addTxId } = SwappingState.actions;

export default SwappingState.reducer;
