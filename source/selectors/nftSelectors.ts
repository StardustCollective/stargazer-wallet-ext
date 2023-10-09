/// //////////////////////
// Modules
/// //////////////////////

import { RootState } from 'state/store';

/// //////////////////////
// Selectors
/// //////////////////////

export const getNftsCollections = (state: RootState) => state.nfts.collections;
export const getSelectedNft = (state: RootState) => state.nfts.selectedNFT;
