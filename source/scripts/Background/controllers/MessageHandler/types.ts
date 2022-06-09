export type Message = {
  id: string;
  type: string;
  data: {
    asset: string;
    method: string;
    args: any[];
    network: string;
    origin?: string;
    to?: string;
    from?: string;
    value?: string;
    gas?: string;
    data: string;
  };
};

export enum SUPPORTED_EVENT_TYPES {
  accountChanged = 'accountsChanged',
  chainChanged = 'chainChanged', // TODO: implement
  close = 'close',
}

export enum SUPPORTED_WALLET_METHODS {
  getChainId,
  getAccounts,
  getBlockNumber,
  estimateGas,
  sendTransaction,
  signMessage,
  isConnected,
  getNetwork,
  getAddress,
  getBalance,
  getPublicKey,

  // Transparent Implementations
  call,
  gasPrice,
  getBlockByHash,
  getBlockByNumber,
  getBlockTransactionCountByHash,
  getBlockTransactionCountByNumber,
  getCode,
  getFilterChanges,
  getFilterLogs,
  getLogs,
  getStorageAt,
  getTransactionByBlockHashAndIndex,
  getTransactionByBlockNumberAndIndex,
  getTransactionByHash,
  getTransactionCount,
  getTransactionReceipt,
  getUncleByBlockHashAndIndex,
  getUncleByBlockNumberAndIndex,
  getUncleCountByBlockHash,
  getUncleCountByBlockNumber,
  newBlockFilter,
  newFilter,
  protocolVersion,
  uninstallFilter,
}

export const SUPPORTED_WALLET_METHODS_NAMES: Record<SUPPORTED_WALLET_METHODS, string>  = {
  [SUPPORTED_WALLET_METHODS.getChainId]: "getChainId",
  [SUPPORTED_WALLET_METHODS.getAccounts]: "getAccounts",
  [SUPPORTED_WALLET_METHODS.getBlockNumber]: "getBlockNumber",
  [SUPPORTED_WALLET_METHODS.estimateGas]: "estimateGas",
  [SUPPORTED_WALLET_METHODS.sendTransaction]: "sendTransaction",
  [SUPPORTED_WALLET_METHODS.signMessage]: "signMessage",
  [SUPPORTED_WALLET_METHODS.isConnected]: "isConnected",
  [SUPPORTED_WALLET_METHODS.getNetwork]: "getNetwork",
  [SUPPORTED_WALLET_METHODS.getAddress]: "getAddress",
  [SUPPORTED_WALLET_METHODS.getBalance]: "getBalance",
  [SUPPORTED_WALLET_METHODS.getPublicKey]: "getPublicKey",

  // Transparent Implementations
  [SUPPORTED_WALLET_METHODS.call]: "call",
  [SUPPORTED_WALLET_METHODS.gasPrice]: "gasPrice",
  [SUPPORTED_WALLET_METHODS.getBlockByHash]: "getBlockByHash",
  [SUPPORTED_WALLET_METHODS.getBlockByNumber]: "getBlockByNumber",
  [SUPPORTED_WALLET_METHODS.getBlockTransactionCountByHash]: "getBlockTransactionCountByHash",
  [SUPPORTED_WALLET_METHODS.getBlockTransactionCountByNumber]: "getBlockTransactionCountByNumber",
  [SUPPORTED_WALLET_METHODS.getCode]: "getCode",
  [SUPPORTED_WALLET_METHODS.getFilterChanges]: "getFilterChanges",
  [SUPPORTED_WALLET_METHODS.getFilterLogs]: "getFilterLogs",
  [SUPPORTED_WALLET_METHODS.getLogs]: "getLogs",
  [SUPPORTED_WALLET_METHODS.getStorageAt]: "getStorageAt",
  [SUPPORTED_WALLET_METHODS.getTransactionByBlockHashAndIndex]: "getTransactionByBlockHashAndIndex",
  [SUPPORTED_WALLET_METHODS.getTransactionByBlockNumberAndIndex]: "getTransactionByBlockNumberAndIndex",
  [SUPPORTED_WALLET_METHODS.getTransactionByHash]: "getTransactionByHash",
  [SUPPORTED_WALLET_METHODS.getTransactionCount]: "getTransactionCount",
  [SUPPORTED_WALLET_METHODS.getTransactionReceipt]: "getTransactionReceipt",
  [SUPPORTED_WALLET_METHODS.getUncleByBlockHashAndIndex]: "getUncleByBlockHashAndIndex",
  [SUPPORTED_WALLET_METHODS.getUncleByBlockNumberAndIndex]: "getUncleByBlockNumberAndIndex",
  [SUPPORTED_WALLET_METHODS.getUncleCountByBlockHash]: "getUncleCountByBlockHash",
  [SUPPORTED_WALLET_METHODS.getUncleCountByBlockNumber]: "getUncleCountByBlockNumber",
  [SUPPORTED_WALLET_METHODS.newBlockFilter]: "newBlockFilter",
  [SUPPORTED_WALLET_METHODS.newFilter]: "newFilter",
  [SUPPORTED_WALLET_METHODS.protocolVersion]: "protocolVersion",
  [SUPPORTED_WALLET_METHODS.uninstallFilter]: "uninstallFilter",
}

export const TRANSPARENT_WALLET_METHODS = [
  SUPPORTED_WALLET_METHODS.call,
  SUPPORTED_WALLET_METHODS.gasPrice,
  SUPPORTED_WALLET_METHODS.getBlockByHash,
  SUPPORTED_WALLET_METHODS.getBlockByNumber,
  SUPPORTED_WALLET_METHODS.getBlockTransactionCountByHash,
  SUPPORTED_WALLET_METHODS.getBlockTransactionCountByNumber,
  SUPPORTED_WALLET_METHODS.getCode,
  SUPPORTED_WALLET_METHODS.getFilterChanges,
  SUPPORTED_WALLET_METHODS.getFilterLogs,
  SUPPORTED_WALLET_METHODS.getLogs,
  SUPPORTED_WALLET_METHODS.getStorageAt,
  SUPPORTED_WALLET_METHODS.getTransactionByBlockHashAndIndex,
  SUPPORTED_WALLET_METHODS.getTransactionByBlockNumberAndIndex,
  SUPPORTED_WALLET_METHODS.getTransactionByHash,
  SUPPORTED_WALLET_METHODS.getTransactionCount,
  SUPPORTED_WALLET_METHODS.getTransactionReceipt,
  SUPPORTED_WALLET_METHODS.getUncleByBlockHashAndIndex,
  SUPPORTED_WALLET_METHODS.getUncleByBlockNumberAndIndex,
  SUPPORTED_WALLET_METHODS.getUncleCountByBlockHash,
  SUPPORTED_WALLET_METHODS.getUncleCountByBlockNumber,
  SUPPORTED_WALLET_METHODS.newBlockFilter,
  SUPPORTED_WALLET_METHODS.newFilter,
  SUPPORTED_WALLET_METHODS.protocolVersion,
  SUPPORTED_WALLET_METHODS.uninstallFilter,
] as const;

export const SUPPORTED_CHAINS = ['constellation', 'ethereum'];
