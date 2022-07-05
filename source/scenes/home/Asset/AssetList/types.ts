import IAssetListState, { IAssetInfoState } from "state/assets/types";
import { IAssetState, IWalletState } from "state/vault/types";

export interface IAssetList {
  assets: IAssetListState;
  allAssets: IAssetInfoState[];
  loading: boolean;
  searchValue: string;
  onSearch: (text: string) => any;
  toggleAssetItem: (assetInfo: any, value: any) => void;
  activeWallet: IWalletState;
  activeNetworkAssets: IAssetState[];
}

export interface IAssetListContainer {
  navigation: any;
};