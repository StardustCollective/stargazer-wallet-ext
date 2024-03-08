import { KeyringWalletState } from '@stardust-collective/dag4-keyring';

export default interface IRemoveWalletHeader {
  wallet: KeyringWalletState;
  title: string;
  subtitle: string;
}
