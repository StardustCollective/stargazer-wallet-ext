import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ALKIMI_LOGO,
  AVALANCHE_LOGO,
  BSC_LOGO,
  CONSTELLATION_LOGO,
  DODI_LOGO,
  DOR_LOGO,
  ELPACA_LOGO,
  ETHEREUM_LOGO,
  GEOJAM_LOGO,
  JENNYCO_LOGO,
  LATTICE_LOGO,
  LEET_LOGO,
  POLYGON_LOGO,
  VE_LTX_LOGO,
} from 'constants/index';
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
    logo: CONSTELLATION_LOGO,
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
    logo: ETHEREUM_LOGO,
    priceId: 'ethereum',
    decimals: 18,
  },
  {
    id: 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2',
    address: 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM',
    label: 'DOR',
    symbol: 'DOR',
    decimals: 8,
    type: AssetType.Constellation,
    logo: DOR_LOGO,
    network: 'main2',
    l0endpoint: 'http://l0-lb-mainnet.getdor.com:7000',
    l1endpoint: 'http://cl1-lb-mainnet.getdor.com:8000',
    priceId: 'dor',
  },
  {
    id: 'DAG7ChnhUF7uKgn8tXy45aj4zn9AFuhaZr8VXY43-main2',
    address: 'DAG7ChnhUF7uKgn8tXy45aj4zn9AFuhaZr8VXY43',
    label: 'Elpaca',
    symbol: 'PACA',
    decimals: 8,
    type: AssetType.Constellation,
    logo: ELPACA_LOGO,
    network: 'main2',
    l0endpoint: 'http://elpaca-l0-2006678808.us-west-1.elb.amazonaws.com:9100',
    l1endpoint: 'http://elpaca-cl1-1512652691.us-west-1.elb.amazonaws.com:9200',
  },
  {
    id: '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet',
    address: '0xa393473d64d2F9F026B60b6Df7859A689715d092',
    label: 'Lattice Token',
    symbol: 'LTX',
    type: AssetType.ERC20,
    priceId: 'lattice-token',
    network: 'mainnet',
    logo: LATTICE_LOGO,
    decimals: 8,
  },
  {
    id: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet',
    address: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349',
    label: 'Lattice Governance',
    symbol: 'veLTX',
    type: AssetType.ERC20,
    priceId: 'lattice-governance',
    network: 'mainnet',
    logo: VE_LTX_LOGO,
    decimals: 18,
  },
  {
    id: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic',
    address: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6',
    label: 'JennyCo',
    symbol: 'JCO',
    type: AssetType.ERC20,
    priceId: 'jennyco',
    network: 'matic',
    logo: JENNYCO_LOGO,
    decimals: 18,
  },
  {
    id: '0x3106a0a076BeDAE847652F42ef07FD58589E001f-mainnet',
    address: '0x3106a0a076BeDAE847652F42ef07FD58589E001f',
    label: 'Alkimi Exchange',
    symbol: 'ADS',
    type: AssetType.ERC20,
    priceId: 'alkimi',
    network: 'mainnet',
    logo: ALKIMI_LOGO,
    decimals: 18,
  },
  {
    id: '0x23894dc9da6c94ecb439911caf7d337746575a72-mainnet',
    address: '0x23894dc9da6c94ecb439911caf7d337746575a72',
    label: 'Geojam',
    symbol: 'JAM',
    type: AssetType.ERC20,
    priceId: 'geojam',
    network: 'mainnet',
    logo: GEOJAM_LOGO,
    decimals: 18,
  },
  {
    id: '0x4e08f03079c5cd3083ea331ec61bcc87538b7665-mainnet',
    address: '0x4e08f03079c5cd3083ea331ec61bcc87538b7665',
    label: 'DoubleDice',
    symbol: 'DODI',
    type: AssetType.ERC20,
    priceId: 'doubledice-token',
    network: 'mainnet',
    logo: DODI_LOGO,
    decimals: 18,
  },
  {
    id: '0x6758647a4Cd6b4225b922b456Be5C05359012032-mainnet',
    address: '0x6758647a4Cd6b4225b922b456Be5C05359012032',
    label: 'Cyberlete',
    symbol: 'LEET',
    type: AssetType.ERC20,
    priceId: '',
    network: 'mainnet',
    logo: LEET_LOGO,
    decimals: 18,
  },
  // 349: New network should be added here.
  {
    id: AssetType.Avalanche,
    address: '',
    label: 'Avalanche',
    symbol: 'AVAX',
    type: AssetType.Ethereum,
    priceId: 'avalanche-2',
    network: 'avalanche-mainnet',
    logo: AVALANCHE_LOGO,
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
    logo: BSC_LOGO,
    decimals: 18,
  },
  {
    id: AssetType.Polygon,
    address: '',
    label: 'Polygon',
    symbol: 'MATIC',
    type: AssetType.Ethereum,
    priceId: 'matic-network',
    network: 'matic',
    logo: POLYGON_LOGO,
    decimals: 18,
  },
];

export const initialState: IERC20AssetsListState = {
  loading: false,
  erc20assets: null,
  searchAssets: null,
  error: null,
  constellationAssets: constellationInitialValues,
  customAssetForm: {
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: '',
  },
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
    setCustomAsset(
      state: IERC20AssetsListState,
      action: PayloadAction<ICustomAssetForm>
    ) {
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
  },
});

export const { clearSearchAssets, setCustomAsset, clearCustomAsset } =
  ERC20AssetsListState.actions;

export default ERC20AssetsListState.reducer;
