import { StargazerChain } from 'scripts/common';
import type { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

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
  transaction: EthSendTransaction;
  extras: ExtraInfo;
};

export type SignTransactionDataDAG = {
  transaction: {
    from: string;
    to: string;
    value: number;
    fee?: number;
  };
  extras: ExtraDagInfo;
};
