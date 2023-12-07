/* eslint-disable camelcase */

import { IAssetInfoState } from 'state/assets/types';

export interface IProviderInfoState {
  id: string;
  label: string;
  logo: string;
}

export interface IProviderDataState {
  requestId: string;
  loading: boolean;
  data: any;
  error: any;
}

export interface ISupportedAssetsState {
  loading: boolean;
  data: SupportedAssetSimplex[];
  error: any;
}

export interface ISupportedAssetsFiltered {
  loading: boolean;
  data: IAssetInfoState[];
  error: any;
}

export interface IPaymentRequestState {
  loading: boolean;
  data: any;
  error: any;
}

export interface IProvidersListState {
  [id: string]: IProviderInfoState;
}

export default interface IProvidersState {
  response: IProviderDataState;
  paymentRequest: IPaymentRequestState;
  selected: IProviderInfoState;
  supportedAssets: ISupportedAssetsState;
  list: IProvidersListState;
}

export type GetQuoteRequest = {
  id: string;
  provider: string;
  digital_currency: string;
  requested_amount: number;
};

export type PaymentRequestBody = {
  quote_id: string;
  user_id: string;
  provider: string;
  digital_currency: string;
  address: string;
};

export type PaymentRequestResponse = {
  is_kyc_update_required: boolean;
  payment_id: string;
};

export type GetQuoteResponse = {
  data: {
    user_id: string;
    quote_id: string;
    wallet_id: string;
    digital_money: {
      currency: string;
      amount: number;
    };
    fiat_money: {
      currency: string;
      base_amount: number;
      total_amount: number;
    };
    valid_until: string;
    supported_digital_currencies: string[];
  };
};

export type SupportedAssetSimplex = {
  name: string;
  ticker_symbol: string;
  'memo/tag_field': string;
  fixed_min_amount?: any;
  networks: string[];
};

export type GetSupportedAssetsResponse = {
  data: SupportedAssetSimplex[];
};

export enum Providers {
  Simplex = 'simplex',
}
