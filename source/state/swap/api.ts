/////////////////////////
// Imports
/////////////////////////

import { createAsyncThunk } from '@reduxjs/toolkit';

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
  IExolixTransaction,
} from './types';
import { RootState } from 'state/store';
import { AssetSymbol, AssetType } from 'state/vault/types';
import { STARGAZER_SWAPPING_BASE_URL_PROD } from 'constants/index';
import { walletHasDag, walletHasEth } from 'utils/wallet';

/////////////////////////
// Constants
/////////////////////////

const SEARCH_END_POINT = '/currencies';
const RATE_END_POINT = '/rate';
const TRANSACTION_END_POINT = '/transactions';
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
  'base-mainnet': 'BASE',
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
    const { assets, vault } = thunkAPI.getState() as RootState;
    const { balances, activeWallet } = vault;
    const assetsArray = Object.values(assets);

    const hasEth = walletHasEth(activeWallet);
    const hasDag = walletHasDag(activeWallet);

    // Filter assets with non-zero balances
    const assetsToCheck = assetsArray.filter((asset) => {
      const isSupported =
        ([AssetType.Ethereum, AssetType.ERC20].includes(asset.type) && hasEth) ||
        (asset.type === AssetType.Constellation && hasDag);

      const assetBalance = balances[asset?.id];
      const positiveBalance =
        !!assetBalance && !!Number(assetBalance) && Number(assetBalance) > 0;

      return isSupported && positiveBalance;
    });

    // Create parallel requests for all assets
    const assetRequests = assetsToCheck.map(async (asset) => {
      let symbol = asset.symbol;

      // Special handling for Base network's ETH
      if (asset.id === AssetType.Base) {
        symbol = AssetSymbol.ETH; // Search for ETH since BASE_ETH won't return results
      }

      const response = await fetch(
        `${STARGAZER_SWAPPING_BASE_URL_PROD}${SEARCH_END_POINT}`,
        {
          method: POST_METHOD,
          headers: HEADERS,
          body: JSON.stringify({
            search: symbol,
            withNetworks: WITH_NETWORKS_BOOLEAN,
          }),
        }
      );

      const json: ISearchResponse = await response.json();
      return { asset, json };
    });

    // Execute all requests in parallel
    const results = await Promise.all(assetRequests);
    const supportedAssets: ISearchCurrency[] = [];

    // Process results
    for (const { asset, json } of results) {
      const { count, data } = json;
      if (!count) continue;

      for (const currency of data) {
        if (
          currency.code === (asset.id === AssetType.Base ? AssetSymbol.ETH : asset.symbol)
        ) {
          const mappedLocalToExolixNetwork = LOCAL_TO_EXOLIX_NETWORK_MAP[asset.network];

          for (const network of currency.networks) {
            // For Base network's ETH, only include the BASE network
            if (asset.id === AssetType.Base) {
              if (network.network !== 'BASE') continue;
            } else {
              // For regular ETH, skip the BASE network
              if (asset.id === AssetType.Ethereum && network.network === 'BASE') continue;
            }

            if (
              mappedLocalToExolixNetwork === network.network ||
              AssetType.Constellation === network.name.toLocaleLowerCase() ||
              (network.name.toLocaleLowerCase().includes(AssetType.Ethereum) &&
                AssetType.Ethereum === currency.name.toLocaleLowerCase())
            ) {
              supportedAssets.push({
                id: asset.id,
                code: asset.id === AssetType.Base ? AssetSymbol.ETH : asset.symbol,
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
