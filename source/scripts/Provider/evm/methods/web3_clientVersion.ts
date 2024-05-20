import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

export const web3_clientVersion = (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  return `Stargazer/v${STARGAZER_WALLET_VERSION}`;
};
