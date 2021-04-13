import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetType } from 'state/wallet/types';
import ERC20_TOKEN_LIST from './tokens';

import IAssetListState, { IAssetInfoState } from './types';
import ConstellationLogo from 'assets/images/svg/constellation.svg';
import EthereumLogo from 'assets/images/svg/ethereum.svg';

const initialState: IAssetListState = {
  [AssetType.Ethereum]: {
    id: AssetType.Ethereum,
    name: 'Ethereum',
    type: AssetType.Ethereum,
    symbol: 'ETH',
    native: true,
    network: 'both',
    logo: EthereumLogo,
    priceId: 'ethereum',
    decimals: 18,
  },
  [AssetType.Constellation]: {
    id: AssetType.Constellation,
    name: 'Constellation',
    type: AssetType.Constellation,
    symbol: 'DAG',
    native: true,
    network: 'both',
    logo: ConstellationLogo,
    priceId: 'constellation-labs',
    decimals: 8,
  },
  ...ERC20_TOKEN_LIST,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AssetListState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addERC20Asset(
      state: IAssetListState,
      action: PayloadAction<IAssetInfoState>
    ) {
      if (action.payload.address) {
        state[action.payload.address] = action.payload;
      }
    },
  },
});

export const { addERC20Asset } = AssetListState.actions;

export default AssetListState.reducer;
