import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getWalletInfo, WINDOW_TYPES } from '../utils';

export interface ISignDataParams {
  payload: string;
}

export const dag_signData = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowType, windowSize } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  validateHardwareMethod({ walletType: activeWallet.type, method: request.method });

  const [address, payload] = request.params as [string, string];

  if (typeof payload !== 'string') {
    throw new Error("Bad argument 'payload' -> must be a string");
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

  const signDataParams: ISignDataParams = {
    payload,
  };

  if (windowType === WINDOW_TYPES.popup) {
    windowSize.height = 812;
    windowSize.width = 380;
  }

  await StargazerExternalPopups.executePopup({
    params: {
      data: signDataParams,
      message,
      origin: sender.origin,
      route: ExternalRoute.SignData,
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
