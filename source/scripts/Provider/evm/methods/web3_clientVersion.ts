import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

export const web3_clientVersion = (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  return `Stargazer/v${STARGAZER_WALLET_VERSION}`;
};
