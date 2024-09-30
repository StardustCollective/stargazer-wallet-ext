import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ALKIMI_LOGO,
  AVALANCHE_LOGO,
  BSC_LOGO,
  CONSTELLATION_LOGO,
  DOR_LOGO,
  ELPACA_LOGO,
  ETHEREUM_LOGO,
  GEOJAM_LOGO,
  JENNYCO_LOGO,
  LATTICE_LOGO,
  POLYGON_LOGO,
  VE_LTX_LOGO,
} from 'constants/index';
import { AssetType } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from './types';

export const initialState: IAssetListState = {
  [AssetType.Ethereum]: {
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
  [AssetType.Constellation]: {
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
  'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2': {
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
  'DAG7ChnhUF7uKgn8tXy45aj4zn9AFuhaZr8VXY43-main2': {
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
  // 349: New network should be added here.
  [AssetType.Avalanche]: {
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
  [AssetType.BSC]: {
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
  [AssetType.Polygon]: {
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
  '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet': {
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
  '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet': {
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
  '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic': {
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
  '0x3106a0a076BeDAE847652F42ef07FD58589E001f-mainnet': {
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
  '0x23894dc9da6c94ecb439911caf7d337746575a72-mainnet': {
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
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AssetListState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    rehydrate(_: IAssetListState, action: PayloadAction<IAssetListState>) {
      return action.payload;
    },
    addAsset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        state[action.payload.id] = action.payload;
      }
    },
    removeAsset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        delete state[action.payload.id];
      }
    },
    updateAssetDecimals(
      state: IAssetListState,
      action: PayloadAction<{ assetId: string; decimals: number }>
    ) {
      if (action.payload.assetId && action.payload.decimals) {
        state[action.payload.assetId].decimals = action.payload.decimals;
      }
    },
  },
});

export const { addAsset, removeAsset, updateAssetDecimals, rehydrate } =
  AssetListState.actions;

export default AssetListState.reducer;
