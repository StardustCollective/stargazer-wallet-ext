import { Ref } from 'react';
import { IWalletState } from 'state/vault/types';

export type IRemoveWalletView = {
  route: any;
  navigation: any;
};

export default interface IRemoveWalletSettings {
  goBack: () => void;
  wallet: IWalletState;
  isSeedWallet: boolean;
  handleSubmit: (data: any) => void;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => void;
}
