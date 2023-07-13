import { AllChainsIds } from 'scripts/Background/controllers/EVMChainController/types';
import { AssetType } from 'state/vault/types';

export interface IAssetInfoState {
  id: string; //for native this is network name, for ERC-20 this is the contract (address)
  label: string;
  type: AssetType;
  symbol: string;
  native?: true;
  // if `native` is "true", `network` should be "both"
  network?: 'both' | AllChainsIds | string;
  logo?: string;
  priceId?: string;
  decimals: number;
  address: string;
  custom?: boolean;
  l0endpoint?: string;
  l1endpoint?: string;
  // contractAddress?: string;
}

export default interface IAssetListState {
  [id: string]: IAssetInfoState;
}
