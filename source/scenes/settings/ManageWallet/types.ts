import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { Ref } from 'react';
import { Control, FieldValues, OnSubmit, ValidationOptions } from 'react-hook-form';

export type IManageWalletView = {
  route: any;
  navigation: any;
};

export default interface IManageWalletSettings {
  walletId: string;
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: (options: ValidationOptions) => Ref<any>;
  control: Control<FieldValues>;
  wallet: KeyringWalletState;
  onSubmit: (data: any) => void;
  onCancelClicked: () => void;
  onShowRecoveryPhraseClicked: () => void;
  onDeleteWalletClicked: () => void;
  onShowPrivateKeyClicked: () => void;
  watch: any;
  isCopied: boolean;
  copyText: (text: string) => void;
  dagAddress: string;
  ethAddress: string;
}
