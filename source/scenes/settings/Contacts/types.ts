import IContactBookState from 'state/contacts/types';

export type IContactsView = {
  navigation: any;
};

export default interface IContactSettings {
  contacts: IContactBookState;
  handleSelect: (id: string) => void;
  addContactLabel: string;
}
