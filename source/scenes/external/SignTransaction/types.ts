import type { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

export enum TransactionType {
  DagNative = 'dag-native',
  DagMetagraph = 'dag-metagraph',
  EvmNative = 'evm-native',
  Erc20Transfer = 'erc20-transfer',
  Erc20Approve = 'erc20-approve',
  EvmContractInteraction = 'evm-contract-interaction',
}

export type SignTransactionDataEVM = {
  type: TransactionType;
  transaction: EthSendTransaction;
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
