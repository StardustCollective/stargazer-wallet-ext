import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INFTListState, ICollectionData, IOpenSeaDetailedNFT } from './types';

const initialState: INFTListState = {
  collections: {
    loading: false,
    error: null,
    data: null,
  },
  selectedNFT: null,
};

const NFTListState = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    setCollectionsLoading(state: INFTListState, action: PayloadAction<boolean>) {
      state.collections.loading = action.payload;
    },
    setCollections(state: INFTListState, action: PayloadAction<ICollectionData>) {
      state.collections.data = action.payload;
    },
    setSelectedNFT(state: INFTListState, action: PayloadAction<IOpenSeaDetailedNFT>) {
      state.selectedNFT = action.payload;
    },
    clearCollections(state: INFTListState) {
      state.collections.loading = false;
      state.collections.data = null;
      state.collections.error = null;
    },
    clearSelectedNFT(state: INFTListState) {
      state.selectedNFT = null;
    },
  },
});

export const {
  setCollectionsLoading,
  setCollections,
  setSelectedNFT,
  clearCollections,
  clearSelectedNFT,
} = NFTListState.actions;

export default NFTListState.reducer;
