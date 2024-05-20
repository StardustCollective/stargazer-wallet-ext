import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';

import {
  IRpcChainRequestHandler,
  AvailableMethods,
  StargazerRequest,
  StargazerRequestMessage,
} from '../../common';
import {
  dag_requestAccounts,
  dag_accounts,
  dag_chainId,
  dag_signData,
  dag_signMessage,
  dag_getBalance,
  dag_getPublicKey,
  dag_sendTransaction,
  dag_getTransaction,
  dag_getPendingTransaction,
  dag_getMetagraphBalance,
  dag_sendMetagraphTransaction,
  dag_getMetagraphTransaction,
  wallet_watchAsset,
  dag_getMetagraphPendingTransaction,
} from './methods';

export class ConstellationProvider implements IRpcChainRequestHandler {
  async handleProxiedRequest(
    _request: StargazerRequest & { type: 'rpc' },
    _message: StargazerRequestMessage,
    _sender: chrome.runtime.MessageSender
  ) {
    throw new Error('handleProxiedRequest is not available on ConstellationProvider');
  }

  async handleNonProxiedRequest(
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    const UNAUTH_METHODS = [
      AvailableMethods.dag_requestAccounts,
      AvailableMethods.dag_accounts,
    ];

    if (!isDappConnected(sender.origin) && !UNAUTH_METHODS.includes(request.method)) {
      throw new Error(
        'Provider is not activated. Call dag_requestAccounts to activate it.'
      );
    }

    switch (request.method) {
      case AvailableMethods.dag_requestAccounts:
        return dag_requestAccounts(request, message, sender);
      case AvailableMethods.dag_accounts:
        return dag_accounts(request, message, sender);
      case AvailableMethods.dag_chainId:
        return dag_chainId(request, message, sender);
      case AvailableMethods.dag_getBalance:
        return dag_getBalance(request, message, sender);
      case AvailableMethods.dag_signData:
        return dag_signData(request, message, sender);
      case AvailableMethods.dag_signMessage:
        return dag_signMessage(request, message, sender);
      case AvailableMethods.dag_getPublicKey:
        return dag_getPublicKey(request, message, sender);
      case AvailableMethods.dag_sendTransaction:
        return dag_sendTransaction(request, message, sender);
      case AvailableMethods.dag_getPendingTransaction:
        return dag_getPendingTransaction(request, message, sender);
      case AvailableMethods.dag_getTransaction:
        return dag_getTransaction(request, message, sender);
      case AvailableMethods.dag_getMetagraphBalance:
        return dag_getMetagraphBalance(request, message, sender);
      case AvailableMethods.dag_sendMetagraphTransaction:
        return dag_sendMetagraphTransaction(request, message, sender);
      case AvailableMethods.dag_getMetagraphTransaction:
        return dag_getMetagraphTransaction(request, message, sender);
      case AvailableMethods.dag_getMetagraphPendingTransaction:
        return dag_getMetagraphPendingTransaction(request, message, sender);
      case AvailableMethods.wallet_watchAsset:
        return wallet_watchAsset(request, message, sender);

      default:
        throw new Error('Unsupported non-proxied method');
    }
  }
}
