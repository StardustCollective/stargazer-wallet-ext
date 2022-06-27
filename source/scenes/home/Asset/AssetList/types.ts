import IAssetListState from "state/assets/types";

export interface IAssetList {
  assets: IAssetListState;
  allAssets: any;
  loading: boolean;
  searchValue: string;
  onSearch: (text: string) => any;
  toggleAssetItem: (assetInfo: any, value: any) => void;
}

export interface IAssetListContainer {
  navigation: any;
};