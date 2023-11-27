import { IOpenSeaCollectionWithChain, IOpenSeaNFT } from 'state/nfts/types';

export type INFTList = {
  navigation: any;
  route: any;
};

export type NFTListProps = {
  selectedCollection: IOpenSeaCollectionWithChain;
  loading: boolean;
  data: IOpenSeaNFT[];
  onPressNFT: (nft: IOpenSeaNFT) => void;
  onSearch: (text: string) => void;
  onRefresh: () => void;
  searchValue: string;
  hasItems: boolean;
};
