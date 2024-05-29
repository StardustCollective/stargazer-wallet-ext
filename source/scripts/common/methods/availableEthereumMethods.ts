import { ProtocolProvider } from '../chains';
import { AvailableMethods } from '../availableMethods';
import { AvailableChainMethod } from '../availableChainMethods';

const AvailableEthereumChainMethods: AvailableChainMethod[] = [
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_accounts,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_requestAccounts,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.personal_sign,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_sendTransaction,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.web3_sha3,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.web3_clientVersion,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_signTypedData,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_signTypedData_v4,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.wallet_switchEthereumChain,
    proxied: false,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.net_version,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_blockNumber,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_call,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_chainId,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_estimateGas,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_gasPrice,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getBalance,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getBlockByHash,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getBlockByNumber,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getBlockTransactionCountByHash,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getBlockTransactionCountByNumber,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getCode,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getFilterChanges,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getFilterLogs,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getLogs,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getStorageAt,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getTransactionByBlockHashAndIndex,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getTransactionByBlockNumberAndIndex,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getTransactionByHash,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getTransactionCount,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getTransactionReceipt,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getUncleByBlockHashAndIndex,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getUncleByBlockNumberAndIndex,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getUncleCountByBlockHash,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_getUncleCountByBlockNumber,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_newBlockFilter,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_newFilter,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_protocolVersion,
    proxied: true,
    permissions: [],
  },
  {
    chain: ProtocolProvider.ETHEREUM,
    method: AvailableMethods.eth_uninstallFilter,
    proxied: true,
    permissions: [],
  },
];

export type { AvailableChainMethod };
export { AvailableEthereumChainMethods };
