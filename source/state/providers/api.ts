import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_DEFAULT_TOKENS,
  GET_QUOTE_API,
  GET_SUPPORTED_ASSETS_API,
  PAYMENT_REQUEST_API,
} from 'constants/index';
import { STARGAZER_API_KEY } from 'utils/envUtil';
import { v4 as uuid } from 'uuid';
import {
  GetDefaultTokensResponse,
  GetQuoteRequest,
  GetQuoteResponse,
  GetSupportedAssetsResponse,
  PaymentRequestBody,
  PaymentRequestResponse,
} from './types';

export const getQuote = createAsyncThunk(
  'providers/getQuote',
  async (requestData: GetQuoteRequest): Promise<GetQuoteResponse | any> => {
    const response = await fetch(GET_QUOTE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lattice-api-key': STARGAZER_API_KEY,
      },
      body: JSON.stringify(requestData),
    });
    const responseJson = await response.json();
    return responseJson.data ? responseJson.data : responseJson;
  }
);

export const getBestDeal = createAsyncThunk(
  'providers/getBestDeal',
  async (providersData: {
    [providerId: string]: {
      digital_currency: string;
      amount: number;
    };
  }): Promise<any> => {
    const providers = Object.keys(providersData);
    let bestDealResponse: GetQuoteResponse;
    let bestDealAmount = 0;

    // Build requests array
    const requests: Promise<Response>[] = providers.map((provider) => {
      const requestData: GetQuoteRequest = {
        id: uuid(),
        provider,
        requested_amount: providersData[provider].amount,
        digital_currency: providersData[provider].digital_currency,
      };

      return fetch(GET_QUOTE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lattice-api-key': STARGAZER_API_KEY,
        },
        body: JSON.stringify(requestData),
      });
    });

    // Wait for all responses. Promises are executed in parallel
    const responses = await Promise.all(requests);

    // Compare responses and select the best deal
    for (let response of responses) {
      const responseJson = await response.json();

      // Handle error messages
      if (!bestDealResponse && !!responseJson?.message) {
        bestDealResponse = responseJson;
      }

      if (!responseJson.data) continue;

      const { token_amount } = responseJson.data as GetQuoteResponse;

      if (Number(token_amount) > bestDealAmount) {
        bestDealAmount = Number(token_amount);
        bestDealResponse = { ...responseJson.data };
      }
    }

    return bestDealResponse;
  }
);

export const paymentRequest = createAsyncThunk(
  'providers/paymentRequest',
  async (requestData: PaymentRequestBody): Promise<PaymentRequestResponse | any> => {
    const response = await fetch(PAYMENT_REQUEST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lattice-api-key': STARGAZER_API_KEY,
      },
      body: JSON.stringify(requestData),
    });
    return response.json();
  }
);

export const getSupportedAssets = createAsyncThunk(
  'providers/getSupportedAssets',
  async (): Promise<GetSupportedAssetsResponse | any> => {
    const response = await fetch(`${GET_SUPPORTED_ASSETS_API}/all`);
    return response.json();
  }
);

export const getDefaultTokens = createAsyncThunk(
  'providers/getDefaultTokens',
  async (): Promise<GetDefaultTokensResponse | any> => {
    const response = await fetch(GET_DEFAULT_TOKENS);
    return response.json();
  }
);
