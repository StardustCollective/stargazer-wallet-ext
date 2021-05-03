import { ITransactionInfo } from '../../types';
import { IAssetState, IWalletState } from '../../../state/vault/types';
import { IAssetInfoState } from '../../../state/assets/types';


export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => Promise<void>;
  // getPrivKey: (id: string, pwd: string) => Promise<string | null>;
  // getPrimaryAccount: (pwd: string) => void;
  isValidDAGAddress: (address: string) => boolean;
  isValidERC20Address: (address: string) => boolean;
  // subscribeAccount: (id: string, label?: string) => Promise<string | null>;
  // unsubscribeAccount: (index: number, pwd: string) => boolean;
  // addNewAccount: (label: string) => Promise<string | null>;
  updateTxs: (limit?: number, searchAfter?: string) => Promise<void>;
  getFullETHTxs: () => any[];
  updateWalletLabel: (wallet: IWalletState, label: string) => void;
  updateAccountActiveAsset: (asset: IAssetState) => void;
  addNewAsset: (asset: IAssetInfoState) => Promise<void>;
  // importPrivKeyAccount: (
  //   privKey: string,
  //   label: string,
  //   importWalletType: ImportWalletType
  // ) => Promise<string | null>;
  // removePrivKeyAccount: (id: string, password: string) => boolean;
  getRecommendFee: () => Promise<number>;
  getRecommendETHTxConfig: () => Promise<{
    nonce: number;
    gas: number;
    gasLimit: number;
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
  estimateGasFee: (gas: number, gasLimit?: number) => Promise<number>;
  // watchMemPool: () => void;
  getLatestUpdate: () => Promise<void>;
}
