import { IAssetInfoState } from 'state/assets/types';

export interface IBuyList {
  assets: IAssetInfoState[];
  loading: boolean;
  handleSelectAsset: (asset: IAssetInfoState) => void;
}
