import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import {
  getCurrencyData,
  getSupportedAssets,
  getCurrencyRate,
  getTransactionHistory,
  stageTransaction,
} from './api';
import ISwapState, { ISelectedCurrency, IExolixTransaction } from './types';

export const initialState: ISwapState = {
  currencyData: null,
  loading: false,
  error: null,
  swapFrom: {
    currency: {
      id: 'ethereum',
      code: 'ETH',
      name: 'Ethereum',
      icon: ETHEREUM_LOGO,
      notes: null,
      networks: [
        {
          network: 'ETH',
          name: 'Ethereum',
          shortName: 'ERC20',
          notes: '',
          addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
          isDefault: true,
          depositMinAmount: null,
          memoNeeded: false,
          memoName: '',
          precision: 6,
        },
      ],
    },
    network: {
      network: 'ETH',
      name: 'Ethereum',
      shortName: 'ERC20',
      notes: '',
      addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
      isDefault: true,
      depositMinAmount: null,
      memoNeeded: false,
      memoName: '',
      precision: 6,
    },
  },
  swapTo: {
    currency: {
      code: 'DAG',
      name: 'Constellation',
      icon: CONSTELLATION_LOGO,
      notes: null,
      networks: [
        {
          network: 'DAG',
          name: 'Constellation',
          shortName: '',
          notes: '',
          addressRegex: '^(DAG)[0-9A-Za-z]{30,70}$',
          isDefault: true,
          depositMinAmount: null,
          memoNeeded: false,
          precision: 8,
        },
      ],
    },
    network: {
      network: 'DAG',
      name: 'Constellation',
      shortName: '',
      notes: '',
      addressRegex: '^(DAG)[0-9A-Za-z]{30,70}$',
      isDefault: true,
      depositMinAmount: null,
      memoNeeded: false,
      precision: 8,
    },
  },
  supportedAssets: null,
  currencyRate: {
    rate: null,
    loading: false,
  },
  pendingSwap: null,
  txIds: [],
  transactionHistory: [],
  selectedTransaction: null,
};

const SwappingState = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    rehydrate(state: ISwapState, action: PayloadAction<ISwapState>) {
      // txIds is the only key/values that are presisted for the swap state.
      return {
        ...state,
        txIds: [...state.txIds, ...action.payload.txIds],
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
    setSelectedTransaction(state: ISwapState, action: PayloadAction<IExolixTransaction>) {
      state.selectedTransaction = action.payload;
    },
    addTxId(state: ISwapState, action: PayloadAction<string>) {
      state.txIds = [...state.txIds, action.payload];
    },
    clearPendingSwap(state: ISwapState) {
      state.pendingSwap = null;
    },
    clearCurrencyRate(state: ISwapState) {
      state.currencyRate.rate = null;
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
    builder.addCase(getTransactionHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.pendingSwap = null;
    });
    builder.addCase(getTransactionHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactionHistory = action.payload;
    });
    builder.addCase(getTransactionHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.pendingSwap = null;
    });
  },
});

export const {
  setSwapFrom,
  setSwapTo,
  clearPendingSwap,
  clearCurrencyRate,
  addTxId,
  rehydrate,
  setSelectedTransaction,
} = SwappingState.actions;

export default SwappingState.reducer;
