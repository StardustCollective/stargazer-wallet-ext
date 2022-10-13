/////////////////////////
// Imports
/////////////////////////

import { createAsyncThunk } from "@reduxjs/toolkit";

/////////////////////////
// Utils
/////////////////////////

import { STARGAZER_API_KEY } from 'utils/envUtil';

/////////////////////////
// Types
/////////////////////////

import {
  IStageTransaction,
  ISearchResponse,
  ISearchCurrency,
  ICurrencyRate,
  IPendingTransaction,
  IExolixTransaction
} from "./types";
import { RootState } from 'state/store';


/////////////////////////
// Constants
/////////////////////////

const SWAP_BASE_URL = 'https://api.lattice.exchange/swapping';
const SEARCH_END_POINT = '/currencies';
const RATE_END_POINT = '/rate'
const TRANSACTION_END_POINT = '/transactions';
const BALANCE_ZERO = '0.0';
const WITH_NETWORKS_BOOLEAN = true;
const POST_METHOD = 'POST';
const GET_METHOD = 'GET';

const HEADERS = {
  'x-lattice-api-key': STARGAZER_API_KEY,
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const LOCAL_TO_EXOLIX_NETWORK_MAP = {
  'bsc': 'BNB Smart Chain (BEP20)',
  'matic': 'Polygon',
  'avalanche-mainnet': 'Avalanche',
  'mainnet': 'Ethereum (ERC20)',
}

/////////////////////////
// Funtions
/////////////////////////

// Returns currency data by search query.
export const getCurrencyData = createAsyncThunk(
  'swap/getCurrencyData',
  async (query: string): Promise<ISearchResponse> => {
    const response = await fetch(`${SWAP_BASE_URL}${SEARCH_END_POINT}`, {
      method: POST_METHOD,
      headers: HEADERS,
      body: JSON.stringify({
        search: query,
        withNetworks: WITH_NETWORKS_BOOLEAN,
      })
    });
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
      // Only check assets whos balance are greater than zero.
      if (assetBalance !== BALANCE_ZERO) {
        const response = await fetch(`${SWAP_BASE_URL}${SEARCH_END_POINT}`, {
          method: POST_METHOD,
          headers: HEADERS,
          body: JSON.stringify({
            search: asset.symbol,
            withNetworks: WITH_NETWORKS_BOOLEAN,
          })
        });
        const json = await response.json();
        const { count } = json;
        if (count) {
          supportedAssets.push({
            id: asset.id,
            code: asset.symbol,
            name: asset.label,
            icon: asset.logo,
            balance: assetBalance,
          })
        }
      }
    }
    return supportedAssets;
  }

);

// Returns currency rate for a trading pair
export const getCurrencyRate = createAsyncThunk(
  'swap/getCurrencyRate',
  async ({ coinFrom, coinTo, amount }: { coinFrom: string, coinTo: string, amount: number }): Promise<ICurrencyRate> => {
    const response = await fetch(`${SWAP_BASE_URL}${RATE_END_POINT}`, {
      method: POST_METHOD,
      headers: HEADERS,
      body: JSON.stringify({
        coinFrom,
        coinTo,
        amount,
      })
    });
    const json = await response.json();
    return json.data;
  }
);

// Stages a transaction on Exolix 
export const stageTransaction = createAsyncThunk(
  'swap/stageTransaction',
  async ({ coinFrom, coinTo, amount, withdrawalAddress, refundAddress }: IStageTransaction): Promise<IPendingTransaction> => {

    const response = await fetch(`${SWAP_BASE_URL}${TRANSACTION_END_POINT}`, {
      method: POST_METHOD,
      headers: HEADERS,
      body: JSON.stringify({
        coinFrom,
        coinTo,
        amount,
        withdrawalAddress,
        refundAddress,
      })
    });

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
)

// Get Transaction Histry
export const getTransactionHistory = createAsyncThunk(
  'swap/getTransactionHistory',
  async (_, thunkAPI): Promise<IExolixTransaction[]> => {

    const { swap } = thunkAPI.getState() as RootState;
    const { txIds } = swap;
    const transactionHistory: IExolixTransaction[] = []

    for(let i = 0; i < txIds.length; i++){
      const id = txIds[i];
      const response = await fetch(`${SWAP_BASE_URL}${TRANSACTION_END_POINT}/${id}`, {
        method: GET_METHOD,
        headers: HEADERS,
      });
      const json = await response.json();
      transactionHistory.push(json.data);
    }

    return transactionHistory;
  }
)