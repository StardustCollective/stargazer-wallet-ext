import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  INFTListState,
  ICollectionData,
  IOpenSeaCollectionWithChain,
  IOpenSeaDetailedNFT,
  ITempNFTInfo,
  IUpdateCollectionData,
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
  transferNFT: {
    loading: false,
    error: null,
    data: null,
  },
  tempNFTInfo: null,
  selectedCollection: {
    loading: false,
    data: null,
  },
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
    setCollection(state: INFTListState, action: PayloadAction<IUpdateCollectionData>) {
      const { id, data } = action.payload;
      if (!!id && !!state?.collections?.data) {
        state.collections.data[id] = data;
      }
    },
    setSelectedCollectionLoading(state: INFTListState, action: PayloadAction<boolean>) {
      state.selectedCollection.loading = action.payload;
    },
    setSelectedCollection(
      state: INFTListState,
      action: PayloadAction<IOpenSeaCollectionWithChain>
    ) {
      state.selectedCollection.data = action.payload;
    },
    setSelectedNFTLoading(state: INFTListState, action: PayloadAction<boolean>) {
      state.selectedNFT.loading = action.payload;
    },
    setSelectedNFT(state: INFTListState, action: PayloadAction<IOpenSeaDetailedNFT>) {
      state.selectedNFT.data = action.payload;
    },
    setTempNFTInfo(state: INFTListState, action: PayloadAction<ITempNFTInfo>) {
      state.tempNFTInfo = action.payload;
    },
    setTransferNFTLoading(state: INFTListState, action: PayloadAction<boolean>) {
      state.transferNFT.loading = action.payload;
    },
    setTransferNFTData(state: INFTListState, action: PayloadAction<string>) {
      state.transferNFT.data = action.payload;
    },
    setTransferNFTError(state: INFTListState, action: PayloadAction<any>) {
      state.transferNFT.error = action.payload;
    },
    clearTransferNFT(state: INFTListState) {
      state.transferNFT.loading = false;
      state.transferNFT.error = null;
      state.transferNFT.data = null;
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
      state.selectedCollection.data = null;
      state.selectedCollection.loading = false;
    },
    clearTempoNFTInfo(state: INFTListState) {
      state.tempNFTInfo = null;
    },
  },
});

export const {
  setCollectionsLoading,
  setCollections,
  setCollection,
  setSelectedNFTLoading,
  setSelectedNFT,
  setSelectedCollection,
  setSelectedCollectionLoading,
  setTempNFTInfo,
  setTransferNFTLoading,
  setTransferNFTError,
  setTransferNFTData,
  clearTransferNFT,
  clearCollections,
  clearSelectedNFT,
  clearSelectedCollection,
  clearTempoNFTInfo,
} = NFTListState.actions;

export default NFTListState.reducer;
