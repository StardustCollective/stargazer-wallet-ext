import { StargazerChain } from '../chains';
import { AvailableMethods } from '../availableMethods';
import { AvailableChainMethod } from '../availableChainMethods';

const AvailableConstellationChainMethods: AvailableChainMethod[] = [
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_chainId,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_accounts,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_getBalance,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_signMessage,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_getPublicKey,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_sendTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_getPendingTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: StargazerChain.CONSTELLATION,
    method: AvailableMethods.dag_getTransaction,
    proxied: false,
    permissions: [],
  },
];

export type { AvailableChainMethod };
export { AvailableConstellationChainMethods };
