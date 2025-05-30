import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo, normalizeSignatureRequest } from '../utils';
import { ExternalRoute } from 'web/pages/External/types';
import { validateHardwareMethod } from 'utils/hardware';

export interface ISignMessageParams {
  asset: string;
  payload: string;
  wallet: string;
  chain: string;
  cypherockId: string;
  deviceId?: string;
  bipIndex?: number;
  publicKey?: string;
}

export const dag_signMessage = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const {
    activeWallet,
    deviceId,
    bipIndex,
    windowUrl,
    windowSize,
    windowType,
    cypherockId,
  } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  validateHardwareMethod(activeWallet.type, request.method);

  // Extension 3.6.0+
  let [address, payload] = request.params as [string, string];

  if (typeof payload !== 'string') {
    throw new Error("Bad argument 'payload'");
  }

  if (typeof address !== 'string') {
    throw new Error("Bad argument 'address'");
  }

  /* -- Backwards Compatibility */
  // Extension pre 3.6.0
  if (dag4.account.validateDagAddress(payload)) {
    [payload, address] = [address, payload];
  }
  /* Backwards Compatibility -- */

  if (!dag4.account.validateDagAddress(address)) {
    throw new Error("Bad argument 'address'");
  }

  if (assetAccount.address !== address) {
    throw new Error('The active account is not the requested');
  }

  const payloadEncoded = normalizeSignatureRequest(payload);

  const signMessageParams: ISignMessageParams = {
    asset: 'DAG',
    payload: payloadEncoded,
    wallet: activeWallet.label,
    chain: getChainLabel(),
    deviceId,
    bipIndex,
    cypherockId,
    publicKey: assetAccount?.publicKey,
  };

  await StargazerExternalPopups.executePopup({
    params: {
      data: signMessageParams,
      message,
      origin: sender.origin,
      route: ExternalRoute.SignMessage,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
