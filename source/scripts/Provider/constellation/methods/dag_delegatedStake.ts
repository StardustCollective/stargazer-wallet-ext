import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import type { DelegatedStake } from '@stardust-collective/dag4-network';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { checkArguments, getWalletInfo } from '../utils';

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

  const [data] = request.params as [DelegatedStake];

  if (!data) {
    throw new Error('"data" not found');
  }

  const args = [
    { type: 'string', value: data.source, name: 'source', validations: ['isDagAddress'] },
    { type: 'string', value: data.nodeId, name: 'nodeId', validations: ['no-empty'] },
    {
      type: 'number',
      value: data.amount,
      name: 'amount',
      validations: ['positive', 'no-zero'],
    },
    {
      type: 'number',
      value: data.fee,
      name: 'fee',
      optional: true,
      validations: ['positive'],
    },
    {
      type: 'string',
      value: data.tokenLockRef,
      name: 'tokenLockRef',
      validations: ['no-empty'],
    },
  ];

  checkArguments(args);

  if (dagAccount.address !== data.source) {
    throw new Error('"source" address must be equal to the current active account.');
  }
};

export const dag_delegatedStake = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  validateParams(request);

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  const [data] = request.params as [DelegatedStake];

  const delegatedStakeData: DelegatedStake = {
    ...data,
    fee: 0,
  };

  windowSize.height = 728;

  await StargazerExternalPopups.executePopup({
    params: {
      data: delegatedStakeData,
      message,
      origin: sender.origin,
      route: ExternalRoute.DelegatedStake,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
