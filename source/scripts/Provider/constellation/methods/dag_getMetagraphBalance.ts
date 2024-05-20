import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import IVaultState, { IAssetState } from 'state/vault/types';
import store from 'state/store';
import { getAssetByContractAddress, validateMetagraphAddress } from '../utils';

export const dag_getMetagraphBalance = (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  const [address] = request.params as [unknown];

  validateMetagraphAddress(address);

  const { balances }: IVaultState = store.getState().vault;

  const metagraphAsset: IAssetState = getAssetByContractAddress(address as string);

  return metagraphAsset && balances[metagraphAsset.id];
};
