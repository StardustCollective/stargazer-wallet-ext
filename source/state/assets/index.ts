import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-logo.png',
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
    logo: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/constellation-logo.png',
    priceId: 'constellation-labs',
    decimals: 8,
  },
  '0xa393473d64d2F9F026B60b6Df7859A689715d092': {
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
  '0x3106a0a076BeDAE847652F42ef07FD58589E001f': {
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
  '0x4e08f03079c5cd3083ea331ec61bcc87538b7665': {
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
  '0x23894dc9da6c94ecb439911caf7d337746575a72': {
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
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AssetListState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    rehydrate(state: IAssetListState, action: PayloadAction<IAssetListState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    addERC20Asset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.address) {
        state[action.payload.address] = action.payload;
      }
    },
  },
});

export const { addERC20Asset, rehydrate } = AssetListState.actions;

export default AssetListState.reducer;
