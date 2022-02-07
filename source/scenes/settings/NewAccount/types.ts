import { Ref } from 'react';

export type INewAccountView = {
  // onChange: (id: string) => void;
  navigation: any;
};

export default interface INewAccountSettings {
  onClickResetStack: () => void;
  onShowPhraseClick: () => void;
  onSubmit: (data: any) => void;
  handleSubmit: (callback: any) => void;
  register: Ref<any>;
  control: any;
  accountName: string;
  loading: boolean;
  walletId: string;
}
