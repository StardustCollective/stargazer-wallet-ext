import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo, normalizeSignatureRequest } from '../utils';

export const dag_signMessage = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { activeWallet, deviceId, bipIndex, windowUrl, windowSize, windowType } =
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
    origin,
    asset: 'DAG',
    signatureRequestEncoded,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    deviceId,
    bipIndex,
    chainLabel: getChainLabel(),
  };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    signatureData,
    message,
    sender.origin,
    'signMessage',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
