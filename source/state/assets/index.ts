import { createSlice } from '@reduxjs/toolkit';
import { AssetType } from 'state/wallet/types';

import IAssetListState from './types';

const initialState: IAssetListState = {
  [AssetType.Constellation]: {
    id: AssetType.Constellation,
    name: 'Constellation',
    type: AssetType.Constellation,
    symbol: 'DAG',
    native: true,
    network: 'both',
    logo:
      'https://assets.coingecko.com/coins/images/4645/small/Constellation.jpg?1613976385',
    priceId: 'constellation-labs',
    decimals: 8,
  },
  [AssetType.Ethereum]: {
    id: AssetType.Ethereum,
    name: 'Ethereum',
    type: AssetType.Ethereum,
    symbol: 'ETH',
    native: true,
    network: 'both',
    logo:
      'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    priceId: 'ethereum',
    decimals: 18,
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AssetListState = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
});

export const {} = AssetListState.actions;

export default AssetListState.reducer;
