/////////////////////////
// Imports
/////////////////////////

import { createAsyncThunk } from "@reduxjs/toolkit";

/////////////////////////
// Types
/////////////////////////

import { ISearchResponse, ISearchCurrency, ICurrencyRate, IPendingTransaction } from "./types";
import { RootState } from 'state/store';


/////////////////////////
// Constants
/////////////////////////

const EXOLIX_SEARCH_END_POINT = 'https://exolix.com/api/v2/currencies?withNetworks=true&search=';
const EXOLIX_RATE_END_POINT = 'https://exolix.com/api/v2/rate?'
const EXOLIX_SEND_TRANSACTION_END_POINT = 'https://exolix.com/api/v2/transactions';
const BALANCE_ZERO = '0.0';

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
    const response = await fetch(`${EXOLIX_SEARCH_END_POINT}${query}`);
    return response.json();
  }
);

// Checks against the exolix api if the users assets are supported for swapping.
export const getSupportedAssets = createAsyncThunk(
  'swap/getSupportedAssets',
  async (arg, thunkAPI): Promise<ISearchCurrency[]> => {
    let supportedAssets: ISearchCurrency[] = [];

    const { assets, vault } = thunkAPI.getState() as RootState;
    const { balances } = vault;
    const assetsArray = Object.values(assets);
    const assetsKeysArray = Object.keys(assets);

    for (let i = 0; i < assetsArray.length; i++) {
      const key = assetsKeysArray[i];
      const asset = assetsArray[i];
      const assetBalance = balances[key];
      // Only check assets whos balance is greater than zero.
      if (assetBalance !== BALANCE_ZERO) {
        const response = await fetch(`${EXOLIX_SEARCH_END_POINT}${asset.symbol}`) as any;
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
  async ({coinFrom, coinTo, amount }:{coinFrom: string, coinTo: string, amount: number} ): Promise<ICurrencyRate> => {
    const response = await fetch(`${EXOLIX_RATE_END_POINT}coinFrom=${coinFrom}&coinTo=${coinTo}&amount=${amount}`);
    return response.json();
  }
);


// Stages a transaction on Exolix 
export const sendTransaction = createAsyncThunk(
  'swap/sendTransaction',
  async ({coinFrom, coinTo, amount, withdrawalAddress, refundAddress}:{coinFrom: string, coinTo: string, amount: number, withdrawalAddress: string, refundAddress: string } ): Promise<IPendingTransaction> => {
    console.log(coinFrom, coinTo, amount, withdrawalAddress, refundAddress);
    
    const response = await fetch(`${EXOLIX_SEND_TRANSACTION_END_POINT}`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coinFrom,
        coinTo,
        amount,
        withdrawalAddress,
        refundAddress,
      })
    });

    const data = await response.json();

    console.log(data);

    return {
      id: data.id,
      amount: data.amount,
      amountTo: data.amountTo,
      depositAddress: data.depositAddress,
      withdrawalAddress: data.withdrawalAddress,
      refundAddress: data.refundAddress,
    };
  }
)