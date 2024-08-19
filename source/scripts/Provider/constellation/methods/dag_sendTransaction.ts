import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import {
  ProtocolProvider,
  StargazerRequest,
  StargazerRequestMessage,
} from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getWalletInfo } from '../utils';
import { toDag } from 'utils/number';

export type StargazerTransactionRequest = {
  source: string;
  destination: string;
  amount: number; // In DATUM, 1 DATUM = 0.00000001 DAG
  fee?: number; // In DATUM, 100000000 DATUM = 1 DAG
};

export const dag_sendTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  const [txData] = request.params as [StargazerTransactionRequest];

  const txSource = txData?.source;
  const txDestination = txData?.destination;
  const txAmount = txData?.amount;
  const txFee = txData?.fee || 0;

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

  const txObject = {
    to: txDestination,
    value: toDag(txAmount),
    fee: toDag(txFee),
    chain: ProtocolProvider.CONSTELLATION,
  };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    txObject,
    message,
    sender.origin,
    'sendTransaction',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
