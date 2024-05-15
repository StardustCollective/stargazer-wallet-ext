import { StargazerProxyRequest } from 'scripts/common';
import { getAssetByContractAddress, validateMetagraphAddress } from '../utils';
import IVaultState, { IAssetState } from 'state/vault/types';
import store from 'state/store';

export const dag_getMetagraphBalance = (
  request: StargazerProxyRequest & { type: 'rpc' }
): string => {
  const [address] = request.params as [unknown];

  validateMetagraphAddress(address);

  const { balances }: IVaultState = store.getState().vault;

  const metagraphAsset: IAssetState = getAssetByContractAddress(address as string);

  return metagraphAsset && balances[metagraphAsset.id];
};
