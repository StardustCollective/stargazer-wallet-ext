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
  bestDealCompleted: boolean;
}

export interface ISupportedAssetsState {
  loading: boolean;
  data: StargazerProviderAsset[];
  error: any;
}

export interface IPaymentRequestState {
  loading: boolean;
  data: any;
  error: any;
}

export interface IDefaultTokensState {
  loading: boolean;
  data: {
    [assetId: string]: IAssetInfoState;
  } | null;
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
  defaultTokens: IDefaultTokensState;
}

export type GetQuoteRequest = {
  id: string;
  provider: string;
  digital_currency: string;
  requested_amount: number;
};

export type GetBestDealRequest = {
  [providerId: string]: {
    digital_currency: string;
    amount: number;
  };
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
  id: string;
  quote_id: string;
  user_id?: string;
  token_id: string;
  token_amount: string;
  requested_amount: string;
  valid_until: string;
  provider: string;
};

export type StargazerProviderAsset = {
  id: string;
  name: string;
  symbol: string;
  network: ProviderNetwork;
  locked?: boolean;
  providers: Providers[];
};

export type GetSupportedAssetsResponse = {
  data: StargazerProviderAsset[];
};

export type GetDefaultTokensResponse = {
  data: {
    [assetId: string]: IAssetInfoState;
  };
};

export enum ProviderNetwork {
  Constellation = 'constellation',
  Ethereum = 'ethereum',
  Polygon = 'polygon',
  Avalanche = 'avalanche',
  BSC = 'bsc',
}

export enum Providers {
  Simplex = 'simplex',
  C14 = 'c14',
}

export const MapProviderNetwork = {
  [ProviderNetwork.Constellation]: 'main2',
  [ProviderNetwork.Ethereum]: 'mainnet',
  [ProviderNetwork.Polygon]: 'matic',
  [ProviderNetwork.Avalanche]: 'avalanche-mainnet',
  [ProviderNetwork.BSC]: 'bsc',
};
