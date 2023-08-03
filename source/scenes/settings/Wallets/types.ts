import { IWalletState } from 'state/vault/types';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import IAssetListState from 'state/assets/types';

export type IWalletsView = {
  onChange: (id: string) => void;
  navigation: any;
};

export default interface IWalletSettings {
  wallets: KeyringWalletState[];
  activeWallet: IWalletState;
  assets: IAssetListState;
  privKeyAccounts: Array<any>;
  hardwareWalletAccounts: Array<any>;
  handleManageWallet: (walletId: string) => void;
}
