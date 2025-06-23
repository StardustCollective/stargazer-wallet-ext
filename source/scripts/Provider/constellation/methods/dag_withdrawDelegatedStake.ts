import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { checkArguments, getChainId, getWalletInfo } from '../utils';

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

  const chainId = getChainId();
  validateHardwareMethod({ walletType: activeWallet.type, method: request.method, dagChainId: chainId });

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
};

export const dag_withdrawDelegatedStake = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  validateParams(request);

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  const [data] = request.params as [WithdrawDelegatedStake];

  await StargazerExternalPopups.executePopup({
    params: {
      data,
      message,
      origin: sender.origin,
      route: ExternalRoute.WithdrawDelegatedStake,
      wallet: {
        chain: StargazerChain.CONSTELLATION,
        chainId: getChainId(),
        address: data.source,
      },
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
