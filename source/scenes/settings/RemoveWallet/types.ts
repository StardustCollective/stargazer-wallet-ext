import { Ref } from 'react';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { FieldValues, OnSubmit } from 'react-hook-form';

export type IRemoveWalletView = {
  route: any;
  navigation: any;
};

export default interface IRemoveWalletSettings {
  goBack: () => void;
  wallet: KeyringWalletState;
  isSeedWallet: boolean;
  handleSubmit: (callback: OnSubmit<FieldValues>) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => Promise<void>;
}
