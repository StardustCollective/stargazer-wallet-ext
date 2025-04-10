import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo } from '../utils';
import store from 'state/store';
import { encodeToBase64 } from 'utils/encoding';
import { getFeeEstimation } from 'scenes/external/SendMetagraphData/utils';
import { normalizeObject } from '@stardust-collective/dag4-keystore';
import { getAccountController } from 'utils/controllersUtils';

const validateParams = (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

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

export const dag_sendMetagraphDataTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const [metagraphId, data, sign] = validateParams(request);

  const accountController = getAccountController();

  const assets = store.getState().assets;
  const metagraphAsset = Object.values(assets).find(
    (asset) => asset?.address === metagraphId
  );

  if (!metagraphAsset || !metagraphAsset.dl1endpoint) {
    throw new Error('Invalid metagraph id for data transaction');
  }

  if (!accountController.isValidNode(metagraphAsset.dl1endpoint)) {
    throw new Error(`Invalid L1 data endpoint: ${metagraphAsset.dl1endpoint}`);
  }

  const { activeWallet, windowUrl, windowType, deviceId, bipIndex } = getWalletInfo();

  const dataString = JSON.stringify(normalizeObject(data));
  const dataEncoded = encodeToBase64(dataString);

  const { fee, address, updateHash } = await getFeeEstimation(
    metagraphAsset.dl1endpoint,
    dataString
  );

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
    deviceId,
    bipIndex,
    chainLabel: getChainLabel(),
  };

  const windowSize = { width: 390, height: 700 };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    signatureData,
    message,
    sender.origin,
    'sendMetagraphData',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
