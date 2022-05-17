import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getQuote, getSupportedAssets, paymentRequest } from './api';
import IProvidersState, { Providers } from './types';

export const initialState: IProvidersState = {
  response: {
    requestId: null,
    loading: false,
    data: null,
    error: null,
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
  selected: {
    id: Providers.Simplex,
    label: 'Simplex',
    logo: 'https://lattice-exchange-assets.s3.amazonaws.com/stargazer_simplex/simplex-logo.png',
  },
  list: {
    [Providers.Simplex]: {
      id: Providers.Simplex,
      label: 'Simplex',
      logo: 'https://lattice-exchange-assets.s3.amazonaws.com/stargazer_simplex/simplex-logo.png',
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
      return {
        ...state,
        response: {
          requestId: null,
          loading: false,
          data: null,
          error: null,
        },
      };
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
          requestId: action.payload,
          loading: false,
          data: null,
          error: null,
        },
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
      const data = action.payload?.message ? action.payload : action.payload.data;
      const requestId = action.payload?.data?.id;
      state.response.loading = false;
      state.response.error = null;
      if (requestId === state.response.requestId) {
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
      state.paymentRequest.loading = false;
      state.paymentRequest.data = action.payload.data;
      state.paymentRequest.error = null;
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
      state.supportedAssets.loading = false;
      state.supportedAssets.data = action.payload.data;
      state.supportedAssets.error = null;
    });
    builder.addCase(getSupportedAssets.rejected, (state, action) => {
      state.supportedAssets.loading = false;
      state.supportedAssets.data = null;
      state.supportedAssets.error = action.payload;
    });
  },
});

export const { rehydrate, clearErrors, setRequestId, clearPaymentRequest } = ProviderListState.actions;

export default ProviderListState.reducer;
