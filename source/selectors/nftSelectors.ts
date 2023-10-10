/// //////////////////////
// Modules
/// //////////////////////

import { RootState } from 'state/store';

/// //////////////////////
// Selectors
/// //////////////////////

const getNftsCollections = (state: RootState) => state.nfts.collections;
const getSelectedNft = (state: RootState) => state.nfts.selectedNFT;

export default {
  getNftsCollections,
  getSelectedNft,
};
