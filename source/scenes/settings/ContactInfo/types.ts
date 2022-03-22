import { IContactState } from 'state/contacts/types';

export type IContactInfoView = {
  route: any;
  navigation: any;
};

export default interface IContactInfoSettings {
  codeOpened: boolean;
  setCodeOpened: (isOpen: boolean) => void;
  isCopied: boolean;
  copyText: (text: string) => void;
  handleDelete: () => void;
  handleEdit: () => void;
  contact: IContactState;
}
