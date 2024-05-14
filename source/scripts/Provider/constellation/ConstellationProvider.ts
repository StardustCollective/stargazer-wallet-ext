import type { DappProvider } from '../../Background/dappRegistry';
import {
  IRpcChainRequestHandler,
  StargazerProxyRequest,
  AvailableMethods,
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
    _request: StargazerProxyRequest & { type: 'rpc' },
    _dappProvider: DappProvider,
    _port: chrome.runtime.Port
  ) {
    throw new Error('handleProxiedRequest is not available on ConstellationProvider');
  }

  async handleNonProxiedRequest(
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: chrome.runtime.Port
  ) {
    const UNAUTH_METHODS = [
      AvailableMethods.dag_requestAccounts,
      AvailableMethods.dag_accounts,
    ];

    if (!dappProvider.activated && !UNAUTH_METHODS.includes(request.method)) {
      throw new Error(
        'Provider is not activated. Call dag_requestAccounts to activate it.'
      );
    }

    switch (request.method) {
      case AvailableMethods.dag_requestAccounts:
        return dag_requestAccounts(dappProvider, port);
      case AvailableMethods.dag_accounts:
        return dag_accounts();
      case AvailableMethods.dag_chainId:
        return dag_chainId();
      case AvailableMethods.dag_getBalance:
        return dag_getBalance();
      case AvailableMethods.dag_signData:
        return dag_signData(request, dappProvider, port);
      case AvailableMethods.dag_signMessage:
        return dag_signMessage(request, dappProvider, port);
      case AvailableMethods.dag_getPublicKey:
        return dag_getPublicKey(request);
      case AvailableMethods.dag_sendTransaction:
        return dag_sendTransaction(request, dappProvider, port);
      case AvailableMethods.dag_getPendingTransaction:
        return dag_getPendingTransaction(request);
      case AvailableMethods.dag_getTransaction:
        return dag_getTransaction(request);
      case AvailableMethods.dag_getMetagraphBalance:
        return dag_getMetagraphBalance(request);
      case AvailableMethods.dag_sendMetagraphTransaction:
        return dag_sendMetagraphTransaction(request, dappProvider, port);
      case AvailableMethods.dag_getMetagraphTransaction:
        return dag_getMetagraphTransaction(request);
      case AvailableMethods.dag_getMetagraphPendingTransaction:
        return dag_getMetagraphPendingTransaction(request);
      case AvailableMethods.wallet_watchAsset:
        return wallet_watchAsset(request, dappProvider, port);

      default:
        throw new Error('Unsupported non-proxied method');
    }
  }
}
