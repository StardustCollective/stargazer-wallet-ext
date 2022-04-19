import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { Ref } from 'react';
import { Control, FieldValues, OnSubmit } from 'react-hook-form';

export type IManageWalletView = {
  route: any;
  navigation: any;
};

export default interface IManageWalletSettings {
  walletId: string;
  handleSubmit: (callback: OnSubmit<FieldValues>) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: Ref<any>;
  control: Control<FieldValues>;
  wallet: KeyringWalletState;
  onSubmit: (data: any) => void;
  onCancelClicked: () => void;
  onShowRecoveryPhraseClicked: () => void;
  onDeleteWalletClicked: () => void;
  onShowPrivateKeyClicked: () => void;
}
