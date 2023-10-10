import { ICollectionData, IOpenSeaNFT } from 'state/nfts/types';

export type ICollections = {
  navigation: any;
};

export type CollectionsProps = {
  collections: {
    loading: boolean;
    error: any;
    data: ICollectionData;
  };
  onPressCollection: (nft: IOpenSeaNFT) => void;
};
