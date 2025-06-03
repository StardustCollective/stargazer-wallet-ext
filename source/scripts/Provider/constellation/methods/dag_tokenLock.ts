import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import store from 'state/store';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { checkArguments, getChainLabel, getWalletInfo } from '../utils';

type TokenLock = {
  source: string;
  amount: number;
  unlockEpoch: number | null;
  fee?: number;
  currencyId: string | null;
};

export type TokenLockDataParam = TokenLock & {
  wallet: string;
  walletId: string;
  chain: string;
  latestEpoch: number | null;
  cypherockId?: string;
  publicKey?: string;
};

const validateParams = async (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const dagAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!dagAccount) {
    throw new Error('No active account for the request asset type');
  }

  if (!request.params) {
    throw new Error('params not provided');
  }

  validateHardwareMethod(activeWallet.type, request.method);

  const [data] = request.params as [TokenLock];

  if (!data) {
    throw new Error('invalid params');
  }

  const args = [
    { type: 'string', value: data.source, name: 'source', validations: ['isDagAddress'] },

    {
      type: 'number',
      value: data.amount,
      name: 'amount',
      validations: ['positive', 'no-zero'],
    },
    {
      type: ['number', 'null'],
      value: data.unlockEpoch,
      name: 'unlockEpoch',
      validations: ['positive', 'no-zero'],
    },
    {
      type: ['string', 'null'],
      value: data.currencyId,
      name: 'currencyId',
      validations: ['isDagAddress'],
    },
    {
      type: 'number',
      value: data.fee,
      name: 'fee',
      optional: true,
      validations: ['positive'],
    },
  ];

  checkArguments(args);

  if (dagAccount.address !== data.source) {
    throw new Error('"source" address must be equal to the current active account.');
  }

  const { assets } = store.getState();

  if (data.currencyId) {
    const currencyAsset = Object.values(assets).find(asset => asset.address === data.currencyId);

    if (!currencyAsset) {
      throw new Error('"currencyId" not found in the wallet');
    }

    if (!!currencyAsset && (!currencyAsset.l0endpoint || !currencyAsset.l1endpoint)) {
      throw new Error('"currencyId" must be a valid metagraph address');
    }
  } else {
    const dagAsset = Object.values(assets).find(asset => asset.symbol === 'DAG');

    if (!dagAsset) {
      throw new Error('DAG asset not found in the wallet');
    }
  }

  return { dagAccount };
};

const getLatestEpoch = async (): Promise<number | null> => {
  const latestSnapshot = await dag4.network.l0Api.getLatestSnapshot();
  return latestSnapshot?.value?.epochProgress ?? null;
};

export const dag_tokenLock = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { dagAccount } = await validateParams(request);

  const { activeWallet, windowUrl, windowSize, windowType, cypherockId } = getWalletInfo();

  const [data] = request.params as [TokenLock];

  let latestEpoch = null;

  if (data.unlockEpoch) {
    latestEpoch = await getLatestEpoch();

    if (!latestEpoch) {
      throw new Error('Failed to fetch latest epoch. Try again later.');
    }

    if (data.unlockEpoch <= latestEpoch) {
      throw new Error(`Invalid "unlockEpoch" value. Must be greater than: ${latestEpoch}.`);
    }
  }

  const DEFAULT_FEE = 0;

  const tokenLockData: TokenLockDataParam = {
    wallet: activeWallet.label,
    walletId: activeWallet.id,
    chain: getChainLabel(),
    source: data.source,
    amount: data.amount,
    currencyId: data.currencyId,
    unlockEpoch: data.unlockEpoch,
    fee: data.fee ? data.fee : DEFAULT_FEE,
    latestEpoch,
    cypherockId,
    publicKey: dagAccount?.publicKey,
  };

  windowSize.height = 628;

  await StargazerExternalPopups.executePopup({
    params: {
      data: tokenLockData,
      message,
      origin: sender.origin,
      route: ExternalRoute.TokenLock,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
