export type IContactInfoView = {
  route: any;
  navigation: any;
};

export default interface IContactInfoSettings {
  codeOpened: Boolean;
  setCodeOpened: (isOpen: any) => void;
  isCopied: Boolean;
  copyText: (text: any) => void;
  contacts: object;
  selectedContactId: string;
  handleDelete: () => void;
  handleEdit: () => void;
}
