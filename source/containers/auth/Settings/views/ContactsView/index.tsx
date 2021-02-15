import React, { FC } from 'react';
import UserIcon from '@material-ui/icons/AccountCircleRounded';
import { useSelector } from 'react-redux';

import Button from 'components/Button';
import Icon from 'components/Icon';
import { useSettingsView } from 'hooks/index';
import { ellipsis } from 'containers/auth/helpers';
import { RootState } from 'state/store';
import IContactBookState, { IContactState } from 'state/contacts/types';
import { ADD_CONTACT_VIEW, CONTACT_VIEW } from '../routes';
import styles from './index.scss';

interface IContactsView {
  onSelect: (id: string) => void;
}

const ContactsView: FC<IContactsView> = ({ onSelect }) => {
  const contacts: IContactBookState = useSelector(
    (state: RootState) => state.contacts
  );
  const showView = useSettingsView();
  const handleSelect = (id: string) => {
    onSelect(id);
    showView(CONTACT_VIEW);
  };

  return (
    <div className={styles.contacts}>
      <Button
        type="button"
        variant={styles.add}
        onClick={() => showView(ADD_CONTACT_VIEW)}
      >
        Add contact
      </Button>
      <ul className={styles.list}>
        {Object.values(contacts).map((contact: IContactState) => (
          <li onClick={() => handleSelect(contact.id)} key={contact.id}>
            <div className={styles.contact}>
              <span className={styles.info}>
                <Icon Component={UserIcon} />
                <div>
                  {contact.name}
                  <small>{ellipsis(contact.address)}</small>
                </div>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsView;
