import { IWalletState, IAssetState } from 'state/vault/types';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';

export type IWalletsView = {
  onChange: (id: string) => void;
  navigation: any;
};

export default interface IWalletSettings {
  wallets: KeyringWalletState[];
  activeWallet: IWalletState;
  assets: IAssetState[];
  privKeyAccounts: Array<any>;
  handleSwitchWallet: (walletId: string, accounts: Array<any>) => void;
  handleManageWallet: (ev: any, walletId: string) => void;
}
