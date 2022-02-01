import { Ref } from 'react';
import IContactBookState from 'state/contacts/types';

export type IModifyContactView = {
  selected?: string;
  navigation: any;
  route: any;
};

export default interface IModifyContactSettings {
  handleSubmit: (arg0: any) => void;
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
