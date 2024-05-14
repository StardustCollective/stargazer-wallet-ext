import * as ethers from 'ethers';
import store from 'state/store';
import IVaultState from 'state/vault/types';
import { getChainInfo } from 'scripts/Background/controllers/EVMChainController/utils';
import type { DappProvider } from '../../Background/dappRegistry';
import {
  AvailableMethods,
  IRpcChainRequestHandler,
  StargazerProxyRequest,
  EIPRpcError,
  EIPErrorCodes,
} from '../../common';
import { getNetworkLabel } from './utils';
import {
  eth_requestAccounts,
  eth_accounts,
  personal_sign,
  eth_signTypedData,
  eth_sendTransaction,
  web3_sha3,
  web3_clientVersion,
  wallet_switchEthereumChain,
} from './methods';

export class EVMProvider implements IRpcChainRequestHandler {
  async handleProxiedRequest(
    request: StargazerProxyRequest & { type: 'rpc' },
    _dappProvider: DappProvider,
    _port: chrome.runtime.Port
  ) {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const networkLabel = getNetworkLabel();
    const chainId = activeNetwork[`${networkLabel as keyof typeof activeNetwork}`];
    const networkInfo = getChainInfo(chainId);
    const provider = new ethers.providers.JsonRpcProvider(networkInfo.rpcEndpoint);

    return provider.send(request.method, request.params);
  }

  async handleNonProxiedRequest(
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: chrome.runtime.Port
  ) {
    const UNAUTH_METHODS = [
      AvailableMethods.eth_requestAccounts,
      AvailableMethods.eth_accounts,
    ];

    // Provider needs to be activated before calling any other RPC method
    if (!dappProvider.activated && !UNAUTH_METHODS.includes(request.method)) {
      throw new EIPRpcError(
        'Provider is not activated. Call eth_requestAccounts to activate it.',
        EIPErrorCodes.Unauthorized
      );
    }

    switch (request.method) {
      case AvailableMethods.eth_requestAccounts:
        return eth_requestAccounts(dappProvider, port);
      case AvailableMethods.eth_accounts:
        return eth_accounts();
      case AvailableMethods.personal_sign:
        return personal_sign(request, dappProvider, port);
      case AvailableMethods.eth_signTypedData:
      case AvailableMethods.eth_signTypedData_v4:
        return eth_signTypedData(request, dappProvider, port);
      case AvailableMethods.eth_sendTransaction:
        return eth_sendTransaction(request, dappProvider, port);
      case AvailableMethods.web3_sha3:
        return web3_sha3(request);
      case AvailableMethods.web3_clientVersion:
        return web3_clientVersion();
      case AvailableMethods.wallet_switchEthereumChain:
        return wallet_switchEthereumChain(request);
      default:
        throw new EIPRpcError(
          'Unsupported non-proxied method',
          EIPErrorCodes.Unsupported
        );
    }
  }
}
