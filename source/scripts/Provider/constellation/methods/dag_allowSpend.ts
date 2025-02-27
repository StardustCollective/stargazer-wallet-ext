import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainLabel, getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

type AllowSpendData = {
  metagraphAddress: string;
  token: string;
  amount: number;
  fee: number;
  spenderAddress: string;
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

  const [data] = request.params as [AllowSpendData];

  if (!data.metagraphAddress || !data.token || !data.amount || !data.spenderAddress) {
    throw new Error('Invalid params');
  }
};

export const dag_allowSpend = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  validateParams(request);

  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  const [data] = request.params as [AllowSpendData];

  const allowSpendData = {
    walletLabel: activeWallet.label,
    walletId: activeWallet.id,
    chainLabel: getChainLabel(),
    metagraphAddress: data.metagraphAddress,
    token: data.token,
    amount: data.amount,
    fee: data.fee,
    spenderAddress: data.spenderAddress,
  };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    allowSpendData,
    message,
    sender.origin,
    'allowSpend',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
