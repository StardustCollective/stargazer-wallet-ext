import { AssetType } from 'state/wallet/types';

export interface IAssetInfoState {
  id: string;
  name: string;
  type: AssetType;
  symbol: string;
  native?: boolean;
  // if `native` is "true", `network` should be "both"
  network?: 'both' | 'main' | 'test';
  logo?: string;
  priceId?: string;
  decimals?: number;
  contractAddress?: string;
}

export default interface IAssetListState {
  [assetId: string]: IAssetInfoState;
}
