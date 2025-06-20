import { StargazerChain } from 'scripts/common';

export enum TransactionType {
  DagNative = 'dag-native',
  DagMetagraph = 'dag-metagraph',
  EvmNative = 'evm-native',
  Erc20Transfer = 'erc20-transfer',
  Erc20Approve = 'erc20-approve',
  EvmContractInteraction = 'evm-contract-interaction',
}

export type ExtraInfo = {
  type: TransactionType;
  chain: StargazerChain;
};

export type ExtraDagInfo = ExtraInfo & {
  metagraphAddress?: string;
};

export type SignTransactionDataEVM = {
  from: string;
  to?: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  data?: string;
  chainId?: number;

  extras: ExtraInfo;
};

export type SignTransactionDataDAG = {
  from: string;
  to: string;
  value: number;
  fee?: number;

  extras: ExtraDagInfo;
};
