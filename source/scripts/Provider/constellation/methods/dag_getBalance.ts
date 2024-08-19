import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import store from 'state/store';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { getAssetByType } from '../utils';

export const dag_getBalance = (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  const { balances }: IVaultState = store.getState().vault;

  const stargazerAsset: IAssetState = getAssetByType(AssetType.Constellation);

  return stargazerAsset && balances[AssetType.Constellation];
};
