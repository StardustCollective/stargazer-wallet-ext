import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { type SignTransactionDataDAG, TransactionType } from 'scenes/external/SignTransaction/types';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getWalletInfo, validateMetagraphAddress, WINDOW_TYPES } from '../utils';

export type StargazerMetagraphTransactionRequest = {
  metagraphAddress: string;
  source: string;
  destination: string;
  amount: number; // In DATUM
  fee?: number; // In DATUM
};

export const dag_sendMetagraphTransaction = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  validateHardwareMethod(activeWallet.type, request.method);

  const [data] = request.params as [StargazerMetagraphTransactionRequest];

  const { metagraphAddress, source, destination, amount, fee } = data;

  if (!data) {
    throw new Error('No data provided');
  }

  validateMetagraphAddress(metagraphAddress);

  if (!source || typeof source !== 'string') {
    throw new Error("Bad argument 'source'");
  }

  if (!destination || typeof destination !== 'string') {
    throw new Error("Bad argument 'destination'");
  }

  if (!amount || typeof amount !== 'number') {
    throw new Error("Bad argument 'amount'");
  }

  if (!!fee && typeof fee !== 'number') {
    throw new Error("Bad argument 'fee'");
  }

  if (!dag4.account.validateDagAddress(source)) {
    throw new Error("Invalid address 'source'");
  }

  if (!dag4.account.validateDagAddress(destination)) {
    throw new Error("Invaid address 'destination'");
  }

  if (amount <= 0) {
    throw new Error("'amount' should be greater than 0");
  }

  if (assetAccount.address !== source) {
    throw new Error('The active account is invalid');
  }

  const signMetagraphTxnData: SignTransactionDataDAG = {
    transaction: {
      from: source,
      to: destination,
      value: amount,
      fee: fee ?? 0,
    },

    extras: {
      chain: StargazerChain.CONSTELLATION,
      type: TransactionType.DagMetagraph,
      metagraphAddress,
    },
  };

  if (windowType === WINDOW_TYPES.popup) {
    windowSize.height = 740;
  }

  await StargazerExternalPopups.executePopup({
    params: {
      data: signMetagraphTxnData,
      message,
      origin: sender.origin,
      route: ExternalRoute.SignTransaction,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
