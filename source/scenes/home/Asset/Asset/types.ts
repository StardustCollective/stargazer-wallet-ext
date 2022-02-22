import { IActiveAssetState, IWalletState } from 'state/vault/types';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';

export type IAssetDetail = {
  navigation: any;
};

export default interface IAssetSettings {
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  balanceText: string;
  fiatAmount: string;
  transactions: DAGTransaction[];
  onSendClick: () => void;
  assets: { [address: string]: IActiveAssetState };
}
