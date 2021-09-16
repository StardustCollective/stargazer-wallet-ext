import { IActiveAssetState } from 'state/vault/types';

export interface IAccountInfo {
  assets: {
    [assetId: string]: IActiveAssetState;
  };
}

export interface IETHTxConfig {
  nonce?: number;
  txData?: string;
  gasPrice: number;
  gasLimit?: number;
}

export interface IETHPendingTx {
  txHash: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  network: ETHNetwork;
  assetId: string;
  nonce: number;
  gasPrice: number;
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: string;
  timestamp: number;
  fee?: number;
  ethConfig?: IETHTxConfig;
  nonce?: number;
}

export type ETHNetwork = 'testnet' | 'mainnet';
