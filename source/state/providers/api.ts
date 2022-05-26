import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_QUOTE_API, GET_SUPPORTED_ASSETS_API, PAYMENT_REQUEST_API } from 'constants/index';
import { STARGAZER_API_KEY } from 'utils/envUtil';
import { GetQuoteRequest, GetQuoteResponse, GetSupportedAssetsResponse, PaymentRequestBody, PaymentRequestResponse, Providers } from './types';

export const getQuote = createAsyncThunk(
  'providers/getQuote',
  async (requestData: GetQuoteRequest): Promise<GetQuoteResponse | any> => {
      const response = await fetch(GET_QUOTE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lattice-api-key': STARGAZER_API_KEY
        },
        body: JSON.stringify(requestData),
      });
    return response.json();
  }
);

export const paymentRequest = createAsyncThunk(
  'providers/paymentRequest',
  async (requestData: PaymentRequestBody): Promise<PaymentRequestResponse | any> => {
    const response = await fetch(PAYMENT_REQUEST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lattice-api-key': STARGAZER_API_KEY
      },
      body: JSON.stringify(requestData),
    });
    return response.json();
  }
);

export const getSupportedAssets = createAsyncThunk(
  'providers/getSupportedAssets',
  async (): Promise<GetSupportedAssetsResponse | any> => {
    const response = await fetch(`${GET_SUPPORTED_ASSETS_API}/${Providers.Simplex}`);
    return response.json();
  }
);
