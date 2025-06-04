import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getChainLabel, getWalletInfo, validateMetagraphAddress, WINDOW_TYPES } from '../utils';

import { SignTransactionDataDAG } from './dag_sendTransaction';

export type StargazerMetagraphTransactionRequest = {
  metagraphAddress: string;
  source: string;
  destination: string;
  amount: number; // In DATUM, 1 DATUM = 0.00000001 DAG
  fee?: number; // In DATUM, 100000000 DATUM = 1 DAG
};

export const dag_sendMetagraphTransaction = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowSize, windowType, cypherockId, deviceId } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Constellation);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  validateHardwareMethod(activeWallet.type, request.method);

  const [txData] = request.params as [StargazerMetagraphTransactionRequest];

  const txMetagraphAddress = txData?.metagraphAddress;
  const txSource = txData?.source;
  const txDestination = txData?.destination;
  const txAmount = txData?.amount;
  const txFee = txData?.fee || 0;

  const metagraphToken = validateMetagraphAddress(txMetagraphAddress);

  if (typeof txSource !== 'string') {
    throw new Error("Bad argument 'source'");
  }

  if (typeof txDestination !== 'string') {
    throw new Error("Bad argument 'destination'");
  }

  if (typeof txAmount !== 'number') {
    throw new Error("Bad argument 'amount'");
  }

  if (!!txFee && typeof txFee !== 'number') {
    throw new Error("Bad argument 'fee'");
  }

  if (!dag4.account.validateDagAddress(txSource)) {
    throw new Error("Invalid address 'source'");
  }

  if (!dag4.account.validateDagAddress(txDestination)) {
    throw new Error("Invaid address 'destination'");
  }

  if (txAmount <= 0) {
    throw new Error("'amount' should be greater than 0");
  }

  if (assetAccount.address !== txSource) {
    throw new Error('The active account is invalid');
  }

  const signMetagraphTxnData: SignTransactionDataDAG = {
    assetId: metagraphToken.id,

    from: txSource,
    to: txDestination,
    value: txAmount,
    fee: txFee,

    chain: StargazerChain.CONSTELLATION,
    network: getChainLabel(),

    ...(cypherockId && { cypherockId }),
    ...(assetAccount?.publicKey && { publicKey: assetAccount.publicKey }),
    ...(deviceId && { deviceId }),
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
