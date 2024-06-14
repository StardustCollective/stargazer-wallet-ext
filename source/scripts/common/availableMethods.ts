enum AvailableMethods {
  /* Ethereum */
  eth_accounts = 'eth_accounts',
  eth_requestAccounts = 'eth_requestAccounts',
  personal_sign = 'personal_sign',
  eth_sendTransaction = 'eth_sendTransaction',
  web3_sha3 = 'web3_sha3',
  web3_clientVersion = 'web3_clientVersion',
  net_version = 'net_version',
  eth_blockNumber = 'eth_blockNumber',
  eth_call = 'eth_call',
  eth_chainId = 'eth_chainId',
  eth_estimateGas = 'eth_estimateGas',
  eth_gasPrice = 'eth_gasPrice',
  eth_getBalance = 'eth_getBalance',
  eth_getBlockByHash = 'eth_getBlockByHash',
  eth_getBlockByNumber = 'eth_getBlockByNumber',
  eth_getBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
  eth_getBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
  eth_getCode = 'eth_getCode',
  eth_getFilterChanges = 'eth_getFilterChanges',
  eth_getFilterLogs = 'eth_getFilterLogs',
  eth_getLogs = 'eth_getLogs',
  eth_getStorageAt = 'eth_getStorageAt',
  eth_getTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
  eth_getTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
  eth_getTransactionByHash = 'eth_getTransactionByHash',
  eth_getTransactionCount = 'eth_getTransactionCount',
  eth_getTransactionReceipt = 'eth_getTransactionReceipt',
  eth_getUncleByBlockHashAndIndex = 'eth_getUncleByBlockHashAndIndex',
  eth_getUncleByBlockNumberAndIndex = 'eth_getUncleByBlockNumberAndIndex',
  eth_getUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
  eth_getUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
  eth_newBlockFilter = 'eth_newBlockFilter',
  eth_newFilter = 'eth_newFilter',
  eth_protocolVersion = 'eth_protocolVersion',
  eth_uninstallFilter = 'eth_uninstallFilter',
  eth_signTypedData = 'eth_signTypedData',
  eth_signTypedData_v4 = 'eth_signTypedData_v4', // Alias of eth_signTypedData

  /* Constellation */
  dag_chainId = 'dag_chainId',
  dag_requestAccounts = 'dag_requestAccounts',
  dag_accounts = 'dag_accounts',
  dag_getBalance = 'dag_getBalance',
  dag_signMessage = 'dag_signMessage',
  dag_signData = 'dag_signData',
  dag_getPublicKey = 'dag_getPublicKey',
  dag_sendTransaction = 'dag_sendTransaction',
  dag_getPendingTransaction = 'dag_getPendingTransaction',
  dag_getTransaction = 'dag_getTransaction',

  /* Wallet */
  wallet_switchEthereumChain = 'wallet_switchEthereumChain',
  wallet_watchAsset = 'wallet_watchAsset',

  /* Metagraph */
  dag_getMetagraphBalance = 'dag_getMetagraphBalance',
  dag_sendMetagraphTransaction = 'dag_sendMetagraphTransaction',
  dag_getMetagraphPendingTransaction = 'dag_getMetagraphPendingTransaction',
  dag_getMetagraphTransaction = 'dag_getMetagraphTransaction',
}

export { AvailableMethods };
