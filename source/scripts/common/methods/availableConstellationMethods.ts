import { ProtocolProvider } from '../chains';
import { AvailableMethods } from '../availableMethods';
import { AvailableChainMethod } from '../availableChainMethods';

const AvailableConstellationChainMethods: AvailableChainMethod[] = [
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_chainId,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_accounts,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_requestAccounts,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getBalance,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_signMessage,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_signData,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getPublicKey,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_sendTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getPendingTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getMetagraphBalance,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_sendMetagraphTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getMetagraphPendingTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.dag_getMetagraphTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.CONSTELLATION,
    method: AvailableMethods.wallet_watchAsset,
    proxied: false,
    permissions: [],
  },
];

export type { AvailableChainMethod };
export { AvailableConstellationChainMethods };
