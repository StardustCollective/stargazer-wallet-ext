import { IOpenSeaCollectionWithChain, IOpenSeaNFT } from 'state/nfts/types';

export type INFTList = {
  navigation: any;
};

export type NFTListProps = {
  selectedCollection: IOpenSeaCollectionWithChain;
  data: IOpenSeaNFT[];
  onPressNFT: (nft: IOpenSeaNFT) => void;
  onSearch: (text: string) => void;
  searchValue: string;
  hasItems: boolean;
};
