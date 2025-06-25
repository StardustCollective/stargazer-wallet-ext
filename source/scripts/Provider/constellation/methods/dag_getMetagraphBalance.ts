import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import store from 'state/store';
import { validateMetagraphAddress } from '../utils';
import { getMetagraphCurrencyBalance } from 'dag4/metagraph';

export const dag_getMetagraphBalance = async (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  const [address] = request.params as [unknown];

  const metagraphAsset = validateMetagraphAddress(address);

  // validateMetagraphAddress checks if the asset is active
  const { assets } = store.getState();
  const l0asset = assets[metagraphAsset.id];
  const balanceInDag = await getMetagraphCurrencyBalance(l0asset);

  if (balanceInDag === null) {
    return null;
  }

  return balanceInDag.toString();
};
