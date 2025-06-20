import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { normalizeObject } from '@stardust-collective/dag4-keystore';

import { getFeeEstimation } from 'scenes/external/SendMetagraphData/utils';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import store from 'state/store';

import { getAccountController } from 'utils/controllersUtils';
import { encodeToBase64 } from 'utils/encoding';
import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getChainLabel, getWalletInfo } from '../utils';

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

  if (!metagraphAsset || !metagraphAsset.dl1endpoint) {
    throw new Error('Invalid metagraph id for data transaction');
  }

  if (!accountController.isValidNode(metagraphAsset.dl1endpoint)) {
    throw new Error(`Invalid L1 data endpoint: ${metagraphAsset.dl1endpoint}`);
  }

  const { activeWallet, windowUrl, windowType } = getWalletInfo();

  validateHardwareMethod(activeWallet.type, request.method);

  const dataString = JSON.stringify(normalizeObject(data));
  const dataEncoded = encodeToBase64(dataString);

  const { fee, address, updateHash } = await getFeeEstimation(metagraphAsset.dl1endpoint, dataString);

  const signatureData = {
    origin,
    dataEncoded,
    sign,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    metagraphId,
    feeAmount: fee,
    destinationFeeAddress: address,
    updateHash,
    chainLabel: getChainLabel(),
  };

  const windowSize = { width: 390, height: 700 };

  await StargazerExternalPopups.executePopup({
    params: {
      data: signatureData,
      message,
      origin: sender.origin,
      route: ExternalRoute.SendMetagraphData,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
