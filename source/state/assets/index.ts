import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ALKIMI_LOGO, AVALANCHE_LOGO, BSC_LOGO, CONSTELLATION_LOGO, DODI_LOGO, ETHEREUM_LOGO, GEOJAM_LOGO, LATTICE_LOGO, POLYGON_LOGO } from 'constants/index';
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
  '0x4e08f03079c5cd3083ea331ec61bcc87538b7665-mainnet': {
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
    addERC20Asset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        state[action.payload.id] = action.payload;
      }
    },
    removeERC20Asset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        delete state[action.payload.id];
      }
    },
    updateAssetDecimals(state: IAssetListState, action: PayloadAction<{ assetId: string, decimals: number}>) {
      if (action.payload.assetId && action.payload.decimals) {
        state[action.payload.assetId].decimals = action.payload.decimals;
      }
    },
  },
});

export const { addERC20Asset, removeERC20Asset, updateAssetDecimals, rehydrate } = AssetListState.actions;

export default AssetListState.reducer;
