import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { DAG_NETWORK } from 'constants/index';
import { AssetType } from 'state/vault/types';
import store from 'state/store';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { checkWatchAssetParams, fetchMetagraphBalance, getWalletInfo } from '../utils';

export type WatchAssetOptions = {
  chainId: number; // The chain ID of the asset. 1 (mainnet), 3 (testnet), 4 (integrationnet)
  address: string; // Metagraph address
  l0: string; // L0 endpoint
  l1: string; // L1 endpoint
  name: string; // Name of the asset
  symbol: string; // Symbol of the asset
  logo: string; // Logo of the token
};

export type WatchAssetParameters = {
  type: string; // The asset's interface, e.g. 'L0'
  options: WatchAssetOptions;
};

export const wallet_watchAsset = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { activeWallet } = store.getState().vault;

  const [params] = request.params as [WatchAssetParameters];

  await checkWatchAssetParams(params);

  const metagraphAddress = params.options.address;
  const dagAddress = activeWallet?.assets?.find(
    (asset) => asset?.id === AssetType.Constellation
  )?.address;

  if (!dagAddress) {
    throw new Error('DAG address not found');
  }

  const selectedNetwork = Object.values(DAG_NETWORK).find(
    (network) => network.chainId === params.options.chainId
  );

  const balance = await fetchMetagraphBalance(
    selectedNetwork.config.beUrl,
    metagraphAddress,
    dagAddress
  );

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  await StargazerExternalPopups.executePopupWithRequestMessage(
    { ...params, balance },
    message,
    sender.origin,
    'watchAsset',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
