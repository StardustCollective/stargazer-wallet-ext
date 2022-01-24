import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {INFTListState, INFTInfoState} from './types';

const initialState: INFTListState = {};

const NFTListState = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    addNFTAsset(state: INFTListState, action: PayloadAction<INFTInfoState>) {
      if (action.payload.address) {
        state[action.payload.address] = action.payload;
      }
    },
  },
});

export const { addNFTAsset } = NFTListState.actions;

export default NFTListState.reducer;