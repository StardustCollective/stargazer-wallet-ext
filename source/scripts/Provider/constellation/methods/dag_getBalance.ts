import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { getAssetByType } from '../utils';
import store from 'state/store';

export const dag_getBalance = (): string => {
  const { balances }: IVaultState = store.getState().vault;

  const stargazerAsset: IAssetState = getAssetByType(AssetType.Constellation);

  return stargazerAsset && balances[AssetType.Constellation];
};
