import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { ISignMessageParams } from 'scripts/Provider/constellation';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getWalletInfo, normalizeSignatureRequest } from '../utils';

export const personal_sign = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new EIPRpcError('There is no active wallet', EIPErrorCodes.Unauthorized);
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Ethereum);

  if (!assetAccount) {
    throw new EIPRpcError('No active account for the request asset type', EIPErrorCodes.Unauthorized);
  }

  validateHardwareMethod(activeWallet.type, request.method);

  // Extension 3.6.0+
  let [payload, address] = request.params as [string, string];

  if (typeof payload !== 'string') {
    throw new EIPRpcError("Bad argument 'payload'", EIPErrorCodes.Unauthorized);
  }

  if (typeof address !== 'string') {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  /* -- Backwards Compatibility */
  // Extension pre 3.6.0
  if (payload.length === 42 && address.length !== 42) {
    [payload, address] = [address, payload];
  }
  /* Backwards Compatibility -- */

  if (!ethers.utils.isAddress(address)) {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (assetAccount.address.toLocaleLowerCase() !== address.toLocaleLowerCase()) {
    throw new EIPRpcError('The active account is not the requested', EIPErrorCodes.Unauthorized);
  }

  const payloadEncoded = normalizeSignatureRequest(payload);

  const signatureData: ISignMessageParams = {
    payload: payloadEncoded,
  };

  await StargazerExternalPopups.executePopup({
    params: {
      data: signatureData,
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
