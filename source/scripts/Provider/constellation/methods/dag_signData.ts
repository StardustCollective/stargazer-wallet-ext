import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo } from '../utils';

export const dag_signData = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
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
    origin,
    dataEncoded,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    deviceId,
    bipIndex,
    chainLabel: getChainLabel(),
  };
  const windowSize = { width: 372, height: 812 };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    signatureData,
    message,
    sender.origin,
    'signData',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
