import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INFTListState, INFTInfoState } from './types';

const initialState: INFTListState = {};

const NFTListState = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    rehydrate(state: INFTListState, action: PayloadAction<INFTInfoState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    addNFTAsset(state: INFTListState, action: PayloadAction<INFTInfoState>) {
      if (action.payload.id) {
        state[action.payload.id] = action.payload;
      }
      return state;
    },
    resetNFTState() {
      return initialState;
    },
  },
});

export const { addNFTAsset, resetNFTState, rehydrate } = NFTListState.actions;

export default NFTListState.reducer;
