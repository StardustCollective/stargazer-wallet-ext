import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getWalletInfo, normalizeSignatureRequest } from '../utils';

export interface ISignMessageParams {
  asset?: string;
  payload: string;
}

export const dag_signMessage = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  validateHardwareMethod({ walletType: activeWallet.type, method: request.method });

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
    payload: payloadEncoded,
  };

  await StargazerExternalPopups.executePopup({
    params: {
      data: signMessageParams,
      message,
      origin: sender.origin,
      route: ExternalRoute.SignMessage,
      wallet: {
        chain: StargazerChain.CONSTELLATION,
        address,
      },
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
