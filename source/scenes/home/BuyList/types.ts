import { ISupportedAssetsFiltered } from 'state/providers/types';

export interface IBuyList {
  supportedAssets: ISupportedAssetsFiltered;
  handleSelectAsset: (assetId: string) => void;
}
