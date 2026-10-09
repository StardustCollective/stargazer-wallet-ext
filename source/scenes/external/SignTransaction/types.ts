import type { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

export enum TransactionType {
  DagNative = 'dag-native',
  DagMetagraph = 'dag-metagraph',
  EvmNative = 'evm-native',
  Erc20Transfer = 'erc20-transfer',
  TokenAllowance = 'token-allowance',
  CollectionApproval = 'collection-approval',
  TokenTransferFrom = 'token-transfer-from',
  EvmContractInteraction = 'evm-contract-interaction',
}

export type TokenStandard = 'erc20' | 'erc721' | 'erc1155' | 'unknown';

export type SignTransactionDataEVM = {
  type: TransactionType;
  transaction: EthSendTransaction;
  // Set by handlers whose calldata reads differently per standard (amount vs token ID).
  tokenStandard?: TokenStandard;
};

export type SignTransactionDataDAG = {
  type: TransactionType;
  metagraphAddress?: string;
  transaction: {
    from: string;
    to: string;
    value: number;
    fee?: number;
  };
};
