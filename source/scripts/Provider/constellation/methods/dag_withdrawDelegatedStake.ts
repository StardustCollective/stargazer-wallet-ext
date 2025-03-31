import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { checkArguments, getChainLabel, getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

type WithdrawDelegatedStakeData = {
  source: string;
  stakeRef: string;
};

const validateParams = (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const dagAccount = activeWallet?.accounts?.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!dagAccount) {
    throw new Error('No active account for the request asset type');
  }

  if (!request.params) {
    throw new Error('params not provided');
  }

  const [data] = request.params as [WithdrawDelegatedStakeData];

  if (!data) {
    throw new Error('"data" not found');
  }

  const args = [
    { type: 'string', value: data.source, name: 'source', validations: ['isDagAddress'] },
    { type: 'string', value: data.stakeRef, name: 'stakeRef', validations: ['no-empty'] },
  ];

  checkArguments(args);

  if (dagAccount.address !== data.source) {
    throw new Error('"source" address must be equal to the current active account.');
  }
};

export const dag_withdrawDelegatedStake = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  validateParams(request);

  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  const [data] = request.params as [WithdrawDelegatedStakeData];

  const withdrawDelegatedStakeData = {
    walletLabel: activeWallet.label,
    chainLabel: getChainLabel(),
    ...data,
  };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    withdrawDelegatedStakeData,
    message,
    sender.origin,
    'withdrawDelegatedStake',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
