import { IActiveAssetState } from 'state/vault/types';
import { AllChainsIds } from './Background/controllers/EVMChainController/types';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

export interface AccountItem {
  id?: number;
  bipIndex?: number | null;
  type: KeyringWalletType;
  address: string;
  publicKey: string;
}

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
  memo?: string;
}

export interface IETHPendingTx {
  txHash: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  network: AllChainsIds | string;
  assetId: string;
  nonce?: number;
  gasPrice: number;
  data?: string;
  onConfirmed?: () => void;
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: string;
  timestamp: number;
  fee?: number;
  ethConfig?: IETHTxConfig;
  nonce?: number;
  onConfirmed?: () => void;
}
