import IAssetListState from "state/assets/types";

export interface IAssetList {
  assets: IAssetListState;
  loading: boolean;
  constellationAssets: any[];
  erc20assets: any[];
  toggleAssetItem: (assetInfo: any, value: any) => void;
}

export interface IAssetListContainer {
  navigation: any;
};