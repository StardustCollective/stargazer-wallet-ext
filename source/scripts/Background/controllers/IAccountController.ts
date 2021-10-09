import { ITransactionInfo, IETHPendingTx } from '../../types';
import { IAssetState, IActiveAssetState } from '../../../state/vault/types';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';
import { IAssetInfoState } from 'state/assets/types';
import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';

export interface IAccountController {
  ethClient: XChainEthClient;
  assetsBalanceMonitor: Readonly<AssetsBalanceMonitor>;
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: (activeAsset: IAssetInfoState | IActiveAssetState ) => Promise<void>;
  isValidDAGAddress: (address: string) => boolean;
  isValidERC20Address: (address: string) => boolean;
  // subscribeAccount: (id: string, label?: string) => Promise<string | null>;
  // unsubscribeAccount: (index: number, pwd: string) => boolean;
  // addNewAccount: (label: string) => Promise<string | null>;
  updateTxs: (limit?: number, searchAfter?: string) => Promise<void>;
  getFullETHTxs: () => ITransactionInfo[];
  updateWalletLabel: (walletId: string, label: string) => void;
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
  estimateTotalGasFee: (recipient: string, amount: string, gas: number, gasLimit?: number) => Promise<number>;
  getLatestTxUpdate: () => Promise<void>;
  updatePendingTx: (tx: IETHPendingTx, gasPrice: number, gasLimit: number) => {};
}
