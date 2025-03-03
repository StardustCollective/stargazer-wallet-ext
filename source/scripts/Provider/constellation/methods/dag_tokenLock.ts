import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

type TokenLockData = {
  metagraphAddress: string;
  token: string;
  amount: number;
  fee: number;
  spenderAddress: string;
  unlockEpoch: number;
};

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

  const [data] = request.params as [TokenLockData];

  if (
    !data.metagraphAddress ||
    !data.token ||
    !data.amount ||
    !data.spenderAddress ||
    !data.unlockEpoch
  ) {
    throw new Error('Invalid params');
  }
};

export const dag_tokenLock = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  validateParams(request);

  const { activeWallet, windowUrl, windowType } = getWalletInfo();

  const [data] = request.params as [TokenLockData];

  const tokenLockData = {
    walletLabel: activeWallet.label,
    walletId: activeWallet.id,
    chainLabel: getChainLabel(),
    metagraphAddress: data.metagraphAddress,
    token: data.token,
    amount: data.amount,
    fee: data.fee,
    spenderAddress: data.spenderAddress,
    unlockEpoch: data.unlockEpoch,
  };

  const windowSize = { width: 390, height: 700 };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    tokenLockData,
    message,
    sender.origin,
    'tokenLock',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
