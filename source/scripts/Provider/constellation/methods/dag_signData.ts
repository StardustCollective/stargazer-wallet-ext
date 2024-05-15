import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { EIPRpcError, StargazerProxyRequest } from 'scripts/common';
import { getChainLabel, getWalletInfo } from '../utils';

export const dag_signData = async (
  request: StargazerProxyRequest & { type: 'rpc' },
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string> => {
  const { activeWallet, windowUrl, windowType, deviceId, bipIndex } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  const [address, dataEncoded] = request.params as [string, string];

  if (typeof dataEncoded !== 'string') {
    throw new Error("Bad argument 'dataEncoded' -> must be a string");
  }

  if (typeof address !== 'string') {
    throw new Error("Bad argument 'address' -> must be a string");
  }

  if (!dag4.account.validateDagAddress(address)) {
    throw new Error("Bad argument 'address'");
  }

  if (assetAccount.address !== address) {
    throw new Error('The active account is not the requested');
  }

  const signatureData = {
    origin: dappProvider.origin,
    dataEncoded,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    deviceId,
    bipIndex,
    chainLabel: getChainLabel(),
  };

  const signatureEvent = await dappProvider.createPopupAndWaitForMessage(
    port,
    ExternalMessageID.dataSigned,
    undefined,
    'signData',
    signatureData,
    windowType,
    windowUrl,
    { width: 372, height: 812 }
  );

  if (signatureEvent === null) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  if (!signatureEvent.detail.result) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  return signatureEvent.detail.signature.hex;
};
