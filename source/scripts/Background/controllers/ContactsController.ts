import store from 'state/store';
import {
  addContactAddress,
  deleteContactAddress,
  updateContactAddress,
} from 'state/contacts';

export interface IContactsController {
  modifyContact: (
    type: 'add' | 'edit',
    name: string,
    address: string,
    memo: string,
    id?: string
  ) => void;
  deleteContact: (id: string) => void;
}

const ContactsController = (): IContactsController => {
  const modifyContact = (
    type: 'add' | 'edit',
    name: string,
    address: string,
    memo: string,
    id?: string
  ) => {
    if (type === 'add') {
      store.dispatch(addContactAddress({ name, address, memo }));
    } else if (id) {
      store.dispatch(updateContactAddress({ id, name, address, memo }));
    }
  };

  const deleteContact = (id: string) => {
    store.dispatch(deleteContactAddress({ id }));
  };

  return {
    modifyContact,
    deleteContact,
  };
};

export default ContactsController;
