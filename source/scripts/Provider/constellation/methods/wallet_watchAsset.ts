import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { DAG_NETWORK } from 'constants/index';
import { AssetType } from 'state/vault/types';
import store from 'state/store';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { checkWatchAssetParams, fetchMetagraphBalance, getWalletInfo } from '../utils';
import { ExternalRoute } from 'web/pages/External/types';
import { dag4 } from '@stardust-collective/dag4';

export type WatchAssetOptions = {
  chainId: number; // The chain ID of the asset. 1 (mainnet), 3 (testnet), 4 (integrationnet)
  address: string; // Metagraph address
  l0: string; // L0 endpoint
  cl1?: string; // L1 currency endpoint
  dl1?: string; // L1 data endpoint
  name: string; // Name of the asset
  symbol: string; // Symbol of the asset
  logo?: string; // Logo of the token
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

  let balance = 0;

  if (selectedNetwork.id === DAG_NETWORK.local2.id) {
    // For local development, use the metagraph client directly
    // Block explorer is not available for local metagraph networks
    try {
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: metagraphAddress,
        id: metagraphAddress,
        l0Url: params.options.l0,
        l1Url: params.options.cl1,
        // Block explorer not available for local development
        beUrl: '',
      });
      balance = await metagraphClient.getBalance();
    } catch (err) {
      // If balance fetch fails on local, default to 0
      // This allows the user to still add the token
      console.warn('Failed to fetch local metagraph balance:', err);
      balance = 0;
    }
  } else {
    balance = await fetchMetagraphBalance(
      selectedNetwork.config.beUrl,
      metagraphAddress,
      dagAddress
    );
  }

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  windowSize.height = 678;

  await StargazerExternalPopups.executePopup({
    params: {
      data: { ...params, balance },
      message,
      origin: sender.origin,
      route: ExternalRoute.WatchAsset,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
