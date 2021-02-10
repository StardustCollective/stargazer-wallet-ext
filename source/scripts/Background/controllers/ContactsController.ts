import store from 'state/store';
import { addContactAddress } from 'state/contacts';

export interface IContactsController {
  addContact: (name: string, address: string, memo: string) => void;
}

const ContactsController = (actions: {
  isLocked: () => boolean;
}): IContactsController => {
  const addContact = (name: string, address: string, memo: string) => {
    if (actions.isLocked()) return;
    store.dispatch(addContactAddress({ name, address, memo }));
  };

  return {
    addContact,
  };
};

export default ContactsController;
