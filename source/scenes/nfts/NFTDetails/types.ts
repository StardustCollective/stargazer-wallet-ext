import { IOpenSeaDetailedNFT } from 'state/nfts/types';

export type INFTDetails = {
  navigation: any;
  route: any;
};

export type NFTDetailsProps = {
  quantity: number;
  logo: string;
  selectedNFT: {
    loading: boolean;
    error: any;
    data: IOpenSeaDetailedNFT;
  };
  onPressSendNFT: () => void;
  onPressViewOpenSea: () => void;
};
