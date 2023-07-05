/////////////////////////
// Imports
/////////////////////////

import { createAsyncThunk } from '@reduxjs/toolkit';

/////////////////////////
// Utils
/////////////////////////

import { STARGAZER_API_KEY, STARGAZER_SWAPPING_BASE_URL_PROD } from 'utils/envUtil';

/////////////////////////
// Types
/////////////////////////

import {
  IStageTransaction,
  ISearchResponse,
  ISearchCurrency,
  ICurrencyRate,
  IPendingTransaction,
  IExolixTransaction,
} from './types';
import { RootState } from 'state/store';
import { AssetType } from 'state/vault/types';

/////////////////////////
// Constants
/////////////////////////

const SEARCH_END_POINT = '/currencies';
const RATE_END_POINT = '/rate';
const TRANSACTION_END_POINT = '/transactions';
const BALANCE_ZERO_DECIMAL = '0.0';
const BALANCE_ZERO = '0';
const WITH_NETWORKS_BOOLEAN = true;
const POST_METHOD = 'POST';
const GET_METHOD = 'GET';

const HEADERS = {
  'x-lattice-api-key': STARGAZER_API_KEY,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const LOCAL_TO_EXOLIX_NETWORK_MAP: {
  [key: string]: string;
} = {
  bsc: 'BSC',
  matic: 'MATIC',
  'avalanche-mainnet': 'AVAXC',
  mainnet: 'ETH',
};

/////////////////////////
// Funtions
/////////////////////////

// Returns currency data by search query.
export const getCurrencyData = createAsyncThunk(
  'swap/getCurrencyData',
  async (query: string): Promise<ISearchResponse> => {
    const response = await fetch(
      `${STARGAZER_SWAPPING_BASE_URL_PROD}${SEARCH_END_POINT}`,
      {
        method: POST_METHOD,
        headers: HEADERS,
        body: JSON.stringify({
          search: query,
          withNetworks: WITH_NETWORKS_BOOLEAN,
        }),
      }
    );
    return await response.json();
  }
);

// Checks against the exolix api if the users assets are supported for swapping.
export const getSupportedAssets = createAsyncThunk(
  'swap/getSupportedAssets',
  async (_, thunkAPI): Promise<ISearchCurrency[]> => {
    let supportedAssets: ISearchCurrency[] = [];

    const { assets, vault } = thunkAPI.getState() as RootState;
    const { balances } = vault;
    const assetsArray = Object.values(assets);
    const assetsKeysArray = Object.keys(assets);

    for (let i = 0; i < assetsArray.length; i++) {
      const key = assetsKeysArray[i];
      const asset = assetsArray[i];
      const assetBalance = balances[key];
      // Only check assets whos balance are greater than zero and assetBalance is not undefined
      if (
        assetBalance !== BALANCE_ZERO_DECIMAL &&
        assetBalance !== BALANCE_ZERO &&
        assetBalance !== undefined
      ) {
        const response = await fetch(
          `${STARGAZER_SWAPPING_BASE_URL_PROD}${SEARCH_END_POINT}`,
          {
            method: POST_METHOD,
            headers: HEADERS,
            body: JSON.stringify({
              search: asset.symbol,
              withNetworks: WITH_NETWORKS_BOOLEAN,
            }),
          }
        );
        const json = await response.json();
        const { count, data } = json;
        // Continue if exolix supports the asset.
        if (count) {
          // Check if the asset network is supported by exolix.
          for (let j = 0; j < data.length; j++) {
            const currency = data[j];
            if (currency.code === asset.symbol) {
              const mappedLocalToExolixNetwork =
                LOCAL_TO_EXOLIX_NETWORK_MAP[asset.network];
              for (let k = 0; k < currency.networks.length; k++) {
                const network = currency.networks[k];
                // Push the asset to the supportedAssets array if the network is supported.
                if (
                  mappedLocalToExolixNetwork === network.network ||
                  AssetType.Constellation === network.name.toLocaleLowerCase() ||
                  (network.name.toLocaleLowerCase().includes(AssetType.Ethereum) &&
                    AssetType.Ethereum === currency.name.toLocaleLowerCase())
                ) {
                  supportedAssets.push({
                    id: asset.id,
                    code: asset.symbol,
                    name: asset.label,
                    icon: asset.logo,
                    networks: [network],
                  });
                }
              }
              break;
            }
          }
        }
      }
    }
    return supportedAssets;
  }
);

// Returns currency rate for a trading pair
export const getCurrencyRate = createAsyncThunk(
  'swap/getCurrencyRate',
  async ({
    coinFrom,
    coinFromNetwork,
    coinTo,
    coinToNetwork,
    amount,
  }: {
    coinFrom: string;
    coinFromNetwork: string;
    coinTo: string;
    coinToNetwork: string;
    amount: number;
  }): Promise<ICurrencyRate> => {
    const response = await fetch(`${STARGAZER_SWAPPING_BASE_URL_PROD}${RATE_END_POINT}`, {
      method: POST_METHOD,
      headers: HEADERS,
      body: JSON.stringify({
        coinFrom,
        coinFromNetwork,
        coinTo,
        coinToNetwork,
        amount,
      }),
    });
    const json = await response.json();
    return json.data;
  }
);

// Stages a transaction on Exolix
export const stageTransaction = createAsyncThunk(
  'swap/stageTransaction',
  async ({
    coinFrom,
    networkFrom,
    coinTo,
    networkTo,
    amount,
    withdrawalAddress,
    refundAddress,
  }: IStageTransaction): Promise<IPendingTransaction> => {
    const response = await fetch(
      `${STARGAZER_SWAPPING_BASE_URL_PROD}${TRANSACTION_END_POINT}`,
      {
        method: POST_METHOD,
        headers: HEADERS,
        body: JSON.stringify({
          coinFrom,
          networkFrom,
          coinTo,
          networkTo,
          amount,
          withdrawalAddress,
          refundAddress,
        }),
      }
    );

    const json = await response.json();

    return {
      id: json.data.id,
      amount: json.data.amount,
      amountTo: json.data.amountTo,
      depositAddress: json.data.depositAddress,
      withdrawalAddress: json.data.withdrawalAddress,
      refundAddress: json.data.refundAddress,
    };
  }
);

// Get Transaction Histry
export const getTransactionHistory = createAsyncThunk(
  'swap/getTransactionHistory',
  async (_, thunkAPI): Promise<IExolixTransaction[]> => {
    const { swap } = thunkAPI.getState() as RootState;
    const { txIds } = swap;
    const transactionHistory: IExolixTransaction[] = [];

    for (let i = 0; i < txIds.length; i++) {
      const id = txIds[i];
      const response = await fetch(
        `${STARGAZER_SWAPPING_BASE_URL_PROD}${TRANSACTION_END_POINT}/${id}`,
        {
          method: GET_METHOD,
          headers: HEADERS,
        }
      );
      const json = await response.json();
      transactionHistory.push(json.data);
    }

    return transactionHistory.reverse();
  }
);
