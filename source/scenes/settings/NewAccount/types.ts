import { Ref } from 'react';
import { FieldValues, OnSubmit } from 'react-hook-form';

export type INewAccountView = {
  // onChange: (id: string) => void;
  navigation: any;
};

export default interface INewAccountSettings {
  onClickResetStack: () => void;
  onShowPhraseClick: () => void;
  onSubmit: (data: any) => Promise<void>;
  handleSubmit: (callback: OnSubmit<FieldValues>) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: Ref<any>;
  control: any;
  accountName: string;
  loading: boolean;
  walletId: string;
}
