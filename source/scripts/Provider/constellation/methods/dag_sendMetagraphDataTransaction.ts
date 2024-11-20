import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo } from '../utils';
import store from 'state/store';
import { decodeFromBase64 } from 'utils/encoding';
import { getFeeEstimation } from 'scenes/external/SendMetagraphData/utils';

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

  const [metagraphId, dataEncoded] = request.params as [string, string];

  if (typeof dataEncoded !== 'string') {
    throw new Error("Bad argument 'dataEncoded' -> must be a string");
  }

  if (typeof metagraphId !== 'string') {
    throw new Error("Bad argument 'metagraphId' -> must be a string");
  }

  if (!dag4.account.validateDagAddress(metagraphId)) {
    throw new Error("Bad argument 'metagraphId'");
  }

  return request.params;
};

export const dag_sendMetagraphDataTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const [metagraphId, dataEncoded] = validateParams(request);

  const assets = store.getState().assets;
  const metagraphAsset = Object.values(assets).find(
    (asset) => asset?.address === metagraphId
  );

  if (!metagraphAsset || !metagraphAsset.dl1endpoint) {
    throw new Error('Invalid metagraph id for data transaction');
  }

  const { activeWallet, windowUrl, windowType, deviceId, bipIndex } = getWalletInfo();

  const data = JSON.parse(decodeFromBase64(dataEncoded));

  const { fee, address, updateHash } = await getFeeEstimation(
    metagraphAsset.dl1endpoint,
    data
  );

  const signatureData = {
    origin,
    dataEncoded,
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

  const windowSize = { width: 372, height: 828 };

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
