import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';
import { getERC20Assets, search } from './api';
import IERC20AssetsListState, { ICustomAssetForm } from './types';

export const constellationInitialValues: IAssetInfoState[] = [
  {
    id: AssetType.Constellation,
    label: 'Constellation',
    type: AssetType.Constellation,
    symbol: 'DAG',
    address: '',
    native: true,
    network: 'both',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/constellation-logo.png',
    priceId: 'constellation-labs',
    decimals: 8,
  },
  {
    id: AssetType.Ethereum,
    label: 'Ethereum',
    type: AssetType.Ethereum,
    symbol: 'ETH',
    address: '',
    native: true,
    network: 'both',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-logo.png',
    priceId: 'ethereum',
    decimals: 18,
  },
  {
    id: '0xa393473d64d2F9F026B60b6Df7859A689715d092',
    address: '0xa393473d64d2F9F026B60b6Df7859A689715d092',
    label: 'Lattice Token',
    symbol: 'LTX',
    type: AssetType.ERC20,
    priceId: 'lattice-token',
    network: 'mainnet',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/lattice-logo.png',
    decimals: 8,
  },
  {
    id: '0x3106a0a076BeDAE847652F42ef07FD58589E001f',
    address: '0x3106a0a076BeDAE847652F42ef07FD58589E001f',
    label: 'Alkimi Exchange',
    symbol: 'ADS',
    type: AssetType.ERC20,
    priceId: 'alkimi',
    network: 'mainnet',
    logo: 'https://assets.coingecko.com/coins/images/17979/small/alkimi.PNG',
    decimals: 18,
  },
  {
    id: '0x4e08f03079c5cd3083ea331ec61bcc87538b7665',
    address: '0x4e08f03079c5cd3083ea331ec61bcc87538b7665',
    label: 'DoubleDice',
    symbol: 'DODI',
    type: AssetType.ERC20,
    priceId: 'doubledice-token',
    network: 'mainnet',
    logo: 'https://lattice-exchange-assets.s3.amazonaws.com/dodi-logo.png',
    decimals: 18,
  },
  {
    id: '0x23894dc9da6c94ecb439911caf7d337746575a72',
    address: '0x23894dc9da6c94ecb439911caf7d337746575a72',
    label: 'Geojam',
    symbol: 'JAM',
    type: AssetType.ERC20,
    priceId: 'geojam',
    network: 'mainnet',
    logo: 'https://lattice-exchange-assets.s3.amazonaws.com/geojam.png',
    decimals: 18,
  },
  {
    id: AssetType.Avalanche,
    address: '',
    label: 'AVAX',
    symbol: 'AVAX',
    type: AssetType.Ethereum,
    priceId: 'avalanche-2',
    network: 'avalanche-mainnet',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avalanche-logo.png',
    decimals: 18,
  },
  {
    id: AssetType.BSC,
    address: '',
    label: 'BNB',
    symbol: 'BNB',
    type: AssetType.Ethereum,
    priceId: 'binancecoin',
    network: 'bsc',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc-logo.png',
    decimals: 18,
  },
  {
    id: AssetType.Polygon,
    address: '0x0000000000000000000000000000000000001010',
    label: 'Polygon',
    symbol: 'MATIC',
    type: AssetType.Ethereum,
    priceId: 'matic-network',
    network: 'matic',
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon-logo.png',
    decimals: 18,
  },
];

export const initialState: IERC20AssetsListState = {
  loading: false,
  erc20assets: null,
  searchAssets: null,
  error: null,
  constellationAssets: constellationInitialValues,
  customAssets: [],
  customAssetForm: {
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: '',
  }
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const ERC20AssetsListState = createSlice({
  name: 'erc20assets',
  initialState,
  reducers: {
    clearSearchAssets(state: IERC20AssetsListState) {
      state.loading = false;
      state.searchAssets = [];
    },
    addCustomAsset(state: IERC20AssetsListState, action: PayloadAction<IAssetInfoState>) {
      state.customAssets.push(action.payload);
    },
    removeCustomAsset(state: IERC20AssetsListState, action: PayloadAction<IAssetInfoState>) {
      state.customAssets = state.customAssets.filter(asset => asset.id !== action.payload.id);
    },
    setCustomAsset(state: IERC20AssetsListState, action: PayloadAction<ICustomAssetForm>) {
      state.customAssetForm.tokenAddress = action.payload.tokenAddress;
      state.customAssetForm.tokenName = action.payload.tokenName;
      state.customAssetForm.tokenSymbol = action.payload.tokenSymbol;
      state.customAssetForm.tokenDecimals = action.payload.tokenDecimals;
    },
    clearCustomAsset(state: IERC20AssetsListState) {
      state.customAssetForm.tokenAddress = '';
      state.customAssetForm.tokenName = '';
      state.customAssetForm.tokenSymbol = '';
      state.customAssetForm.tokenDecimals = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getERC20Assets.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.erc20assets = null;
    });
    builder.addCase(getERC20Assets.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.erc20assets = action.payload;
    });
    builder.addCase(getERC20Assets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.erc20assets = null;
    });
    builder.addCase(search.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.searchAssets = null;
    });
    builder.addCase(search.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.searchAssets = action.payload;
    });
    builder.addCase(search.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.searchAssets = null;
    });
  }
});

export const { clearSearchAssets, setCustomAsset, clearCustomAsset, addCustomAsset, removeCustomAsset } = ERC20AssetsListState.actions;

export default ERC20AssetsListState.reducer;
