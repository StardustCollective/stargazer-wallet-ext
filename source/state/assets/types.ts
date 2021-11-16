import { AssetType } from 'state/vault/types';

export interface IAssetInfoState {
  id: string; //for native this is network name, for ERC-20 this is the contract (address)
  label: string;
  type: AssetType;
  symbol: string;
  native?: true;
  // if `native` is "true", `network` should be "both"
  network?: 'both' | 'mainnet' | 'testnet';
  logo?: string;
  priceId?: string;
  decimals: number;
  address: string;
  isDefault?: boolean;
  // contractAddress?: string;
}

export default interface IAssetListState {
  [id: string]: IAssetInfoState;
}
