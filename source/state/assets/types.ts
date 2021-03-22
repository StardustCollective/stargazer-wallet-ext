import { AssetType } from 'state/wallet/types';

export interface IAssetInfoState {
  id: string;
  name: string;
  type: AssetType;
  symbol: string;
  native?: boolean;
  // if `native` is "true", `network` should be "both"
  network?: 'both' | 'mainnet' | 'testnet';
  logo?: string;
  priceId?: string;
  decimals?: number;
  address?: string;
}

export default interface IAssetListState {
  [assetId: string]: IAssetInfoState;
}
