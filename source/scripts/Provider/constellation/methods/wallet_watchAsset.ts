import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { EIPRpcError, StargazerProxyRequest } from 'scripts/common';
import { checkWatchAssetParams, fetchMetagraphBalance, getWalletInfo } from '../utils';
import { DAG_NETWORK } from 'constants/index';
import { AssetType } from 'state/vault/types';
import { useController } from 'hooks/index';
import store from 'state/store';

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
  request: StargazerProxyRequest & { type: 'rpc' },
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<boolean> => {
  const { activeWallet } = store.getState().vault;
  const { windowUrl, windowType, windowSize } = getWalletInfo();

  const [params] = request.params as [WatchAssetParameters];

  await checkWatchAssetParams(params);

  // TODO: remove controller dependency
  const controller = useController();
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

  const watchAssetEvent = await dappProvider.createPopupAndWaitForMessage(
    port,
    ExternalMessageID.watchAssetResult,
    undefined,
    'watchAsset',
    { ...params, balance },
    windowType,
    windowUrl,
    windowSize
  );

  if (watchAssetEvent === null) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  if (watchAssetEvent.detail.error) {
    throw new EIPRpcError(watchAssetEvent.detail.error, 4001);
  }

  if (!watchAssetEvent.detail.result) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  const { l0, l1, address, name, symbol, logo } = params.options;
  await controller.wallet.account.assetsController.addCustomL0Token(
    l0,
    l1,
    address,
    name,
    symbol,
    selectedNetwork.id,
    logo
  );

  return true;
};
