import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAssetInfoState } from 'state/assets/types';
import { ERC20Asset, ERC20AssetWithAddress } from './types';
import { mapSearchAssetsToArray, mapToAssetsArray } from './utils';
import { ExternalApi } from 'utils/httpRequests/apis';
import { ExternalService } from 'utils/httpRequests/constants';

const ERC20_TOKENS_API = 'coins/markets?vs_currency=usd&category=ethereum-ecosystem';
const ERC20_TOKENS_WITH_ADDRESS_API = 'coins/list?include_platform=true';

export const getERC20Assets = createAsyncThunk(
  'assets/getERC20Assets',
  async (): Promise<IAssetInfoState[]> => {
    const [tokensResponse, tokensWithAddressResponse] = await Promise.all([
      ExternalApi.get(`${ExternalService.CoinGecko}/${ERC20_TOKENS_API}`),
      ExternalApi.get(`${ExternalService.CoinGecko}/${ERC20_TOKENS_WITH_ADDRESS_API}`),
    ]);
    const tokensJson: ERC20Asset[] = tokensResponse?.data ?? [];
    const tokensWithAddressJson: ERC20AssetWithAddress[] =
      tokensWithAddressResponse?.data ?? [];
    return mapToAssetsArray(tokensJson, tokensWithAddressJson);
  }
);

export const search = createAsyncThunk(
  'assets/search',
  async (value: string): Promise<IAssetInfoState[]> => {
    const [tokensResponse, tokensWithAddressResponse] = await Promise.all([
      ExternalApi.get(`${ExternalService.CoinGecko}/search?query=${value}`),
      ExternalApi.get(`${ExternalService.CoinGecko}/${ERC20_TOKENS_WITH_ADDRESS_API}`),
    ]);
    const tokensJson = tokensResponse?.data ?? {};
    let tokensWithAddressJson: ERC20AssetWithAddress[] =
      tokensWithAddressResponse?.data ?? [];
    // CoinGecko API returns an error object if it fails.
    if (!Array.isArray(tokensWithAddressJson)) {
      tokensWithAddressJson = [];
    }
    return mapSearchAssetsToArray(tokensJson?.coins, tokensWithAddressJson);
  }
);
