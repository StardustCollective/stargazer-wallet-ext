import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { checkArguments, getChainLabel, getWalletInfo } from '../utils';

export type WithdrawDelegatedStake = {
  source: string;
  stakeRef: string;
};

export type WithdrawDelegatedStakeData = WithdrawDelegatedStake & {
  wallet: string;
  chain: string;
  cypherockId?: string;
  publicKey?: string;
};

const validateParams = (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const dagAccount = activeWallet?.accounts?.find(account => account.network === KeyringNetwork.Constellation);

  if (!dagAccount) {
    throw new Error('No active account for the request asset type');
  }

  if (!request.params) {
    throw new Error('params not provided');
  }

  validateHardwareMethod(activeWallet.type, request.method);

  const [data] = request.params as [WithdrawDelegatedStake];

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

  return dagAccount;
};

export const dag_withdrawDelegatedStake = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const dagAccount = validateParams(request);

  const { activeWallet, windowUrl, windowSize, windowType, cypherockId } = getWalletInfo();

  const [data] = request.params as [WithdrawDelegatedStake];

  const withdrawDelegatedStakeData: WithdrawDelegatedStakeData = {
    wallet: activeWallet.label,
    chain: getChainLabel(),
    ...data,
    ...(cypherockId && { cypherockId }),
    ...(dagAccount?.publicKey && { publicKey: dagAccount.publicKey }),
  };

  await StargazerExternalPopups.executePopup({
    params: {
      data: withdrawDelegatedStakeData,
      message,
      origin: sender.origin,
      route: ExternalRoute.WithdrawDelegatedStake,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
