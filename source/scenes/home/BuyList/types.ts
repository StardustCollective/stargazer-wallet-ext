import { ISupportedAssetsState } from "state/providers/types";

export interface IBuyList {
  supportedAssets: ISupportedAssetsState;
  handleSelectAsset: (assetId: string) => void;
}
