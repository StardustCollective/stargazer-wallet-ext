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
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/simplex-logo.png',
  },
  list: {
    [Providers.Simplex]: {
      id: Providers.Simplex,
      label: 'Simplex',
      logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/simplex-logo.png',
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
      const error = action.payload?.message ? action.payload : null;
      const data = action.payload?.data ? action.payload.data : null;
      const requestId = action.payload?.data?.id;
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
  },
});

export const { rehydrate, clearErrors, setRequestId, clearPaymentRequest } = ProviderListState.actions;

export default ProviderListState.reducer;
