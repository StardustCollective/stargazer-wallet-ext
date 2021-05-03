import { IAssetState } from 'state/vault/types';

export interface IAccountInfo {
  assets: {
    [assetId: string]: IAssetState;
  };
}

export interface IETHTxConfig {
  nonce?: number;
  txData?: string;
  gas: number;
  gasLimit: number;
}

export interface IETHPendingTx {
  txHash: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  network: ETHNetwork;
  assetId: string;
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee?: number;
  ethConfig?: IETHTxConfig;
}

export type ETHNetwork = 'testnet' | 'mainnet';
