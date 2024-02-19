import { Ref } from 'react';
import { FieldValues, OnSubmit } from 'react-hook-form';

export type IPhraseView = {
  id: string;
  route: any;
};

export default interface IPhraseSettings {
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => void;
  checked: boolean;
  phrase: string;
  isCopied: boolean;
  handleCopySeed: () => void;
}
