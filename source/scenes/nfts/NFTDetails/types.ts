import { IOpenSeaCollectionWithChain, IOpenSeaDetailedNFT } from 'state/nfts/types';

export type INFTDetails = {
  navigation: any;
  route: any;
};

export type NFTDetailsProps = {
  logo: string;
  selectedCollection: IOpenSeaCollectionWithChain;
  selectedNFT: {
    loading: boolean;
    error: any;
    data: IOpenSeaDetailedNFT;
  };
  onPressSendNFT: () => void;
};
