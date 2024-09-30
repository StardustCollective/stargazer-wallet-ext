import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { C14_LOGO, SIMPLEX_LOGO } from 'constants/index';
import {
  getBestDeal,
  getDefaultTokens,
  getQuote,
  getSupportedAssets,
  paymentRequest,
} from './api';
import IProvidersState, {
  GetQuoteResponse,
  IProviderInfoState,
  Providers,
} from './types';

export const initialState: IProvidersState = {
  response: {
    requestId: null,
    loading: false,
    data: null,
    error: null,
    bestDealCompleted: false,
  },
  supportedAssets: {
    loading: false,
    data: null,
    error: null,
  },
  paymentRequest: {
    loading: false,
    data: null,
    error: null,
  },
  defaultTokens: {
    loading: false,
    data: null,
    error: null,
  },
  selected: {
    id: Providers.C14,
    label: 'C14',
    logo: C14_LOGO,
  },
  list: {
    [Providers.C14]: {
      id: Providers.C14,
      label: 'C14',
      logo: C14_LOGO,
    },
    [Providers.Simplex]: {
      id: Providers.Simplex,
      label: 'Simplex',
      logo: SIMPLEX_LOGO,
    },
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const ProviderListState = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    rehydrate(state: IProvidersState, action: PayloadAction<IProvidersState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearErrors(state: IProvidersState) {
      state.response.error = null;
      state.paymentRequest.error = null;
      state.supportedAssets.error = null;
    },
    clearResponse(state: IProvidersState) {
      state.response = initialState.response;
    },
    clearBestDeal(state: IProvidersState) {
      state.response.bestDealCompleted = false;
    },
    clearPaymentRequest(state: IProvidersState) {
      return {
        ...state,
        paymentRequest: {
          loading: false,
          data: null,
          error: null,
        },
      };
    },
    setRequestId(state: IProvidersState, action: PayloadAction<string>) {
      return {
        ...state,
        response: {
          ...state.response,
          requestId: action.payload,
          loading: false,
          data: null,
          error: null,
        },
      };
    },
    setSelectedProvider(
      state: IProvidersState,
      action: PayloadAction<IProviderInfoState>
    ) {
      return {
        ...state,
        selected: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuote.pending, (state) => {
      state.response.loading = true;
      state.response.data = null;
      state.response.error = null;
    });
    builder.addCase(getQuote.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data = action.payload?.id ? action.payload : null;
      const requestId = action.payload?.id;

      if (error && !state.response.error) {
        state.response.loading = false;
        state.response.error = error;
      }
      if (requestId === state.response.requestId) {
        state.response.loading = false;
        state.response.data = data;
      }
    });
    builder.addCase(getQuote.rejected, (state, action) => {
      state.response.loading = false;
      state.response.data = null;
      state.response.error = action.payload;
    });
    builder.addCase(paymentRequest.pending, (state) => {
      state.paymentRequest.loading = true;
      state.paymentRequest.data = null;
      state.paymentRequest.error = null;
    });
    builder.addCase(paymentRequest.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data = action.payload?.data ? action.payload.data : null;
      state.paymentRequest.loading = false;
      state.paymentRequest.data = data;
      state.paymentRequest.error = error;
    });
    builder.addCase(paymentRequest.rejected, (state, action) => {
      state.paymentRequest.loading = false;
      state.paymentRequest.data = null;
      state.paymentRequest.error = action.payload;
    });
    builder.addCase(getSupportedAssets.pending, (state) => {
      state.supportedAssets.loading = true;
      state.supportedAssets.data = null;
      state.supportedAssets.error = null;
    });
    builder.addCase(getSupportedAssets.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data = action.payload?.data ? action.payload.data : null;
      state.supportedAssets.loading = false;
      state.supportedAssets.data = data;
      state.supportedAssets.error = error;
    });
    builder.addCase(getSupportedAssets.rejected, (state, action) => {
      state.supportedAssets.loading = false;
      state.supportedAssets.data = null;
      state.supportedAssets.error = action.payload;
    });
    builder.addCase(getBestDeal.pending, (state) => {
      state.response.loading = true;
      state.response.data = null;
      state.response.error = null;
    });
    builder.addCase(getBestDeal.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data: GetQuoteResponse = action.payload?.id ? action.payload : null;

      state.response.loading = false;

      if (data) {
        state.selected = state.list[data.provider];
        state.response.data = data;
        state.response.bestDealCompleted = true;
      }

      if (error) {
        state.response.error = error;
      }
    });
    builder.addCase(getBestDeal.rejected, (state, action) => {
      state.response.loading = false;
      state.response.data = null;
      state.response.error = action.payload;
    });
    builder.addCase(getDefaultTokens.pending, (state) => {
      state.defaultTokens.loading = true;
      state.defaultTokens.data = null;
      state.defaultTokens.error = null;
    });
    builder.addCase(getDefaultTokens.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data = action.payload?.data ? action.payload.data : null;
      state.defaultTokens.loading = false;
      state.defaultTokens.data = data;
      state.defaultTokens.error = error;
    });
    builder.addCase(getDefaultTokens.rejected, (state, action) => {
      state.defaultTokens.loading = false;
      state.defaultTokens.data = null;
      state.defaultTokens.error = action.payload;
    });
  },
});

export const {
  rehydrate,
  clearErrors,
  setRequestId,
  clearPaymentRequest,
  clearBestDeal,
  clearResponse,
  setSelectedProvider,
} = ProviderListState.actions;

export default ProviderListState.reducer;
