import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { checkArguments, getChainLabel, getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import store from 'state/store';
import { toDag } from 'utils/number';
import { dag4 } from '@stardust-collective/dag4';

type TokenLockData = {
  source: string;
  amount: number;
  unlockEpoch: number;
  fee?: number;
  currencyId?: string;
};

const validateParams = (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const dagAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!dagAccount) {
    throw new Error('No active account for the request asset type');
  }

  if (!request.params) {
    throw new Error('params not provided');
  }

  const [data] = request.params as [TokenLockData];

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
      type: 'number',
      value: data.unlockEpoch,
      name: 'unlockEpoch',
      validations: ['positive', 'no-zero'],
    },
    {
      type: 'string',
      value: data.currencyId,
      name: 'currencyId',
      optional: true,
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

  const { assets, vault } = store.getState();
  const { balances } = vault;
  const feeValue = data.fee ?? 0;
  const totalAmount = toDag(data.amount) + toDag(feeValue);

  if (!!data.currencyId) {
    const currencyAsset = Object.values(assets).find(
      (asset) => asset.address === data.currencyId
    );

    if (!currencyAsset) {
      throw new Error('"currencyId" not found in the wallet');
    }

    if (!!currencyAsset && (!currencyAsset.l0endpoint || !currencyAsset.l1endpoint)) {
      throw new Error('"currencyId" must be a valid metagraph address');
    }

    const balance = balances[currencyAsset.id];

    if (!balance || Number(balance) < totalAmount) {
      throw new Error(
        `not enough balance for the selected currency: ${currencyAsset.symbol}`
      );
    }
  } else {
    const dagAsset = Object.values(assets).find((asset) => asset.symbol === 'DAG');

    if (!dagAsset) {
      throw new Error('DAG asset not found in the wallet');
    }

    const balance = balances[dagAsset.id];

    if (!balance || Number(balance) < totalAmount) {
      throw new Error(`not enough DAG balance`);
    }
  }
};

const getLatestEpoch = async (): Promise<number | null> => {
  const latestSnapshot = await dag4.network.l0Api.getLatestSnapshot();
  return latestSnapshot?.value?.epochProgress ?? null;
};

export const dag_tokenLock = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  validateParams(request);

  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  const [data] = request.params as [TokenLockData];

  const latestEpoch = await getLatestEpoch();

  if (!latestEpoch) {
    throw new Error('Failed to fetch latest epoch. Try again later.');
  }

  if (data.unlockEpoch && data.unlockEpoch <= latestEpoch) {
    throw new Error(`Invalid "unlockEpoch" value. Must be greater than: ${latestEpoch}.`);
  }

  const DEFAULT_FEE = 0;

  const tokenLockData = {
    walletLabel: activeWallet.label,
    walletId: activeWallet.id,
    chainLabel: getChainLabel(),
    source: data.source,
    amount: data.amount,
    currencyId: data.currencyId,
    unlockEpoch: data.unlockEpoch,
    fee: data.fee ? data.fee : DEFAULT_FEE,
    latestEpoch,
  };

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
