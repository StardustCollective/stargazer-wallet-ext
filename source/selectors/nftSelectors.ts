/// //////////////////////
// Modules
/// //////////////////////

import { RootState } from 'state/store';

/// //////////////////////
// Selectors
/// //////////////////////

const getNftsCollections = (state: RootState) => state.nfts.collections;
const getSelectedNft = (state: RootState) => state.nfts.selectedNFT;
const getSelectedNftData = (state: RootState) => state.nfts.selectedNFT.data;
const getSelectedCollection = (state: RootState) => state.nfts.selectedCollection;
const getTempNFTInfo = (state: RootState) => state.nfts.tempNFTInfo;
const getTransferNFT = (state: RootState) => state.nfts.transferNFT;

export default {
  getNftsCollections,
  getSelectedNft,
  getSelectedNftData,
  getSelectedCollection,
  getTempNFTInfo,
  getTransferNFT,
};
