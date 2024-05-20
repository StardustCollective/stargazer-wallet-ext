import store from 'state/store';
import { IDAppState } from 'state/dapp/types';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

export const dag_accounts = (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { dapp } = store.getState();
  const { whitelist }: IDAppState = dapp;

  const origin = sender?.origin ?? null;

  if (!origin) {
    return [];
  }

  const dappData = whitelist[origin];

  if (!dappData?.accounts?.constellation) {
    return [];
  }

  return dappData.accounts.constellation;
};
