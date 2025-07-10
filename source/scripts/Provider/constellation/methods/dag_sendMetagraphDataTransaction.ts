import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { normalizeObject } from '@stardust-collective/dag4-keystore';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import store from 'state/store';

import { getAccountController } from 'utils/controllersUtils';
import { encodeToBase64 } from 'utils/encoding';
import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getChainId, getWalletInfo } from '../utils';

export interface ISendMetagraphDataParams {
  sign: boolean;
  metagraphId: string;
  payload: string;
}

const validateParams = (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  const [metagraphId, data] = request.params as [string, object];

  if (typeof data !== 'object') {
    throw new Error("Bad argument 'data' -> must be an object");
  }

  if (typeof metagraphId !== 'string') {
    throw new Error("Bad argument 'metagraphId' -> must be a string");
  }

  if (!dag4.account.validateDagAddress(metagraphId)) {
    throw new Error("Bad argument 'metagraphId' -> must be a valid DAG address");
  }

  return request.params;
};

export const dag_sendMetagraphDataTransaction = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const [metagraphId, data, sign] = validateParams(request);

  const accountController = getAccountController();

  const { assets } = store.getState();
  const metagraphAsset = Object.values(assets).find(asset => asset?.address === metagraphId);

  if (!metagraphAsset) {
    throw new Error('Metagraph id not found in the wallet');
  }

  if (!metagraphAsset.dl1endpoint) {
    throw new Error('Invalid metagraph id for data transaction: data layer endpoint not found');
  }
  const isValidMetagraph = await accountController.isValidNode(metagraphAsset.dl1endpoint);

  if (!isValidMetagraph) {
    throw new Error(`Invalid L1 data endpoint: ${metagraphAsset.dl1endpoint}`);
  }

  const { activeWallet, windowUrl, windowType } = getWalletInfo();

  const chainId = getChainId();
  validateHardwareMethod({ walletType: activeWallet.type, method: request.method, dagChainId: chainId });

  const dataString = JSON.stringify(normalizeObject(data));
  const payload = encodeToBase64(dataString);

  const requestData: ISendMetagraphDataParams = {
    sign,
    metagraphId,
    payload,
  };

  const windowSize = { width: 390, height: 700 };

  await StargazerExternalPopups.executePopup({
    params: {
      data: requestData,
      message,
      origin: sender.origin,
      route: ExternalRoute.SendMetagraphData,
      wallet: {
        chain: StargazerChain.CONSTELLATION,
        chainId,
        address: dag4.account.address,
      },
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
