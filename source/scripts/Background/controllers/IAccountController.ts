import { IAssetInfoState } from 'state/assets/types';
import { ITransactionInfo, IETHPendingTx } from '../../types';
import { IAssetState, IActiveAssetState } from '../../../state/vault/types';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';
import { EthTransactionController } from './EthTransactionController';
import { IAssetsController } from './AssetsController';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import NetworkController from './NetworkController';

export interface IAccountController {
  networkController: NetworkController;
  txController: EthTransactionController;
  assetsController: Readonly<IAssetsController>;
  assetsBalanceMonitor: Readonly<AssetsBalanceMonitor>;
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmContractTempTx: (
    activeAsset: IAssetInfoState | IActiveAssetState
  ) => Promise<string>;
  confirmTempTx: () => Promise<string>;
  isValidDAGAddress: (address: string) => boolean;
  isValidMetagraphAddress: (address: string) => Promise<boolean>;
  isValidNode: (url: string) => Promise<boolean>;
  isValidERC20Address: (address: string) => boolean;
  // subscribeAccount: (id: string, label?: string) => Promise<string | null>;
  // unsubscribeAccount: (index: number, pwd: string) => boolean;
  // addNewAccount: (label: string) => Promise<string | null>;
  updateTxs: (limit?: number, searchAfter?: string) => Promise<void>;
  getFullETHTxs: () => Promise<ITransactionInfo[]>;
  updateWalletLabel: (wallet: KeyringWalletState, label: string) => void;
  updateAccountActiveAsset: (asset: IAssetState) => void;
  addNewToken: (address: string) => Promise<void>;
  getRecommendFee: () => Promise<number>;
  getRecommendETHTxConfig: () => Promise<{
    nonce: number;
    gasPrice: number;
  }>;
  updateETHTxConfig: ({
    nonce,
    gas,
    gasLimit,
  }: {
    gas?: number;
    gasLimit?: number;
    nonce?: number;
  }) => void;
  getLatestGasPrices: () => Promise<number[]>;
  estimateTotalGasFee: (
    recipient: string,
    amount: string,
    gas: number,
    gasLimit?: number
  ) => Promise<number>;
  getLatestTxUpdate: () => Promise<void>;
  updatePendingTx: (tx: IETHPendingTx, gasPrice: number, gasLimit: number) => {};
  fetchCustomToken: (address: string, chainId: string) => Promise<void>;
}
