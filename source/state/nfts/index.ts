import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  INFTListState,
  ICollectionData,
  IOpenSeaCollectionWithChain,
  IOpenSeaDetailedNFT,
} from './types';

const initialState: INFTListState = {
  collections: {
    loading: false,
    error: null,
    data: null,
  },
  selectedNFT: {
    loading: false,
    error: null,
    data: null,
  },
  selectedCollection: null,
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
    setSelectedCollection(
      state: INFTListState,
      action: PayloadAction<IOpenSeaCollectionWithChain>
    ) {
      state.selectedCollection = action.payload;
    },
    setSelectedNFTLoading(state: INFTListState, action: PayloadAction<boolean>) {
      state.selectedNFT.loading = action.payload;
    },
    setSelectedNFT(state: INFTListState, action: PayloadAction<IOpenSeaDetailedNFT>) {
      state.selectedNFT.data = action.payload;
    },
    clearCollections(state: INFTListState) {
      state.collections.loading = false;
      state.collections.data = null;
      state.collections.error = null;
    },
    clearSelectedNFT(state: INFTListState) {
      state.selectedNFT.loading = false;
      state.selectedNFT.error = null;
      state.selectedNFT.data = null;
    },
    clearSelectedCollection(state: INFTListState) {
      state.selectedCollection = null;
    },
  },
});

export const {
  setCollectionsLoading,
  setCollections,
  setSelectedNFTLoading,
  setSelectedNFT,
  setSelectedCollection,
  clearCollections,
  clearSelectedNFT,
  clearSelectedCollection,
} = NFTListState.actions;

export default NFTListState.reducer;
