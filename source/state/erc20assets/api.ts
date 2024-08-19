import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  COINGECKO_API_KEY_PARAM,
  ERC20_TOKENS_API,
  ERC20_TOKENS_WITH_ADDRESS_API,
  SEARCH_API,
} from 'constants/index';
import { IAssetInfoState } from 'state/assets/types';
import { ERC20Asset, ERC20AssetWithAddress } from './types';
import { mapSearchAssetsToArray, mapToAssetsArray } from './utils';

export const getERC20Assets = createAsyncThunk(
  'assets/getERC20Assets',
  async (): Promise<IAssetInfoState[]> => {
    const [tokens, tokensWithAddress] = await Promise.all([
      fetch(`${ERC20_TOKENS_API}&${COINGECKO_API_KEY_PARAM}`),
      fetch(`${ERC20_TOKENS_WITH_ADDRESS_API}&${COINGECKO_API_KEY_PARAM}`),
    ]);
    const tokensJson: ERC20Asset[] = await tokens.json();
    const tokensWithAddressJson: ERC20AssetWithAddress[] = await tokensWithAddress.json();
    return mapToAssetsArray(tokensJson, tokensWithAddressJson);
  }
);

export const search = createAsyncThunk(
  'assets/search',
  async (value: string): Promise<IAssetInfoState[]> => {
    const [tokens, tokensWithAddress] = await Promise.all([
      fetch(`${SEARCH_API}${value}&${COINGECKO_API_KEY_PARAM}`),
      fetch(`${ERC20_TOKENS_WITH_ADDRESS_API}&${COINGECKO_API_KEY_PARAM}`),
    ]);
    const tokensJson = await tokens.json();
    let tokensWithAddressJson: ERC20AssetWithAddress[] = await tokensWithAddress.json();
    // CoinGecko API returns an error object if it fails.
    if (!Array.isArray(tokensWithAddressJson)) {
      tokensWithAddressJson = [];
    }
    return mapSearchAssetsToArray(tokensJson?.coins, tokensWithAddressJson);
  }
);
