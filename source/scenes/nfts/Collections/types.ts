import { ICollectionData, IOpenSeaCollectionWithChain } from 'state/nfts/types';

export type ICollections = {
  navigation: any;
};

export type CollectionsProps = {
  collections: {
    loading: boolean;
    error: any;
    data: ICollectionData;
  };
  onPressCollection: (collection: IOpenSeaCollectionWithChain) => void;
  onSearch: (text: string) => void;
  onRefresh: () => void;
  searchValue: string;
  hasItems: boolean;
};
