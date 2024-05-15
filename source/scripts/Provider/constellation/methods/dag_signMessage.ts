import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { EIPRpcError, StargazerProxyRequest } from 'scripts/common';
import { getChainLabel, getWalletInfo, normalizeSignatureRequest } from '../utils';

export const dag_signMessage = async (
  request: StargazerProxyRequest & { type: 'rpc' },
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string> => {
  const { activeWallet, windowUrl, windowType, windowSize, deviceId, bipIndex } =
    getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  // Extension 3.6.0+
  let [address, signatureRequest] = request.params as [string, string];

  if (typeof signatureRequest !== 'string') {
    throw new Error("Bad argument 'signatureRequest'");
  }

  if (typeof address !== 'string') {
    throw new Error("Bad argument 'address'");
  }

  /* -- Backwards Compatibility */
  // Extension pre 3.6.0
  if (dag4.account.validateDagAddress(signatureRequest)) {
    [signatureRequest, address] = [address, signatureRequest];
  }
  /* Backwards Compatibility -- */

  if (!dag4.account.validateDagAddress(address)) {
    throw new Error("Bad argument 'address'");
  }

  if (assetAccount.address !== address) {
    throw new Error('The active account is not the requested');
  }

  const signatureRequestEncoded = normalizeSignatureRequest(signatureRequest);

  const signatureData = {
    origin: dappProvider.origin,
    asset: 'DAG',
    signatureRequestEncoded,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    deviceId,
    bipIndex,
    chainLabel: getChainLabel(),
  };

  const signatureEvent = await dappProvider.createPopupAndWaitForMessage(
    port,
    ExternalMessageID.messageSigned,
    undefined,
    'signMessage',
    signatureData,
    windowType,
    windowUrl,
    windowSize
  );

  if (signatureEvent === null) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  if (!signatureEvent.detail.result) {
    throw new EIPRpcError('User Rejected Request', 4001);
  }

  return signatureEvent.detail.signature.hex;
};
