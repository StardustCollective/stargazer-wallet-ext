import { IWalletState } from 'state/vault/types';
import { KeyringWalletAccountState, KeyringWalletState } from '@stardust-collective/dag4-keyring';
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
  ledgerAccounts: Array<any>;
  handleSwitchWallet: (walletId: string, accounts: KeyringWalletAccountState[]) => void;
  handleManageWallet: (ev: any, walletId: string) => void;
}
