import { Ref } from 'react';
import { FieldValues, OnSubmit } from 'react-hook-form';
import IContactBookState from 'state/contacts/types';

export type IModifyContactView = {
  selected?: string;
  navigation: any;
  route: any;
};

export default interface IModifyContactSettings {
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onSubmit: (arg0: any) => void;
  handleAddressChange: (arg0: any) => void;
  selected: string;
  hideStatusIcon: boolean;
  contacts: IContactBookState;
  register: Ref<any>;
  address: string;
  isValidAddress: boolean;
  onClickCancel: () => void;
  disabled: boolean;
  control: object;
}
