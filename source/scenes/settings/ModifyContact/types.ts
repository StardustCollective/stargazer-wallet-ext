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
  contacts: object;
  register: object;
  address: string;
  isValidAddress: boolean;
  onClickCancel: () => void;
  disabled: boolean;
}
