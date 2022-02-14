import React, { FC } from 'react';
import Avatar from '@devneser/gradient-avatar';

import { IContactState } from 'state/contacts/types';

import styles from './Contacts.scss';

import IContractSettings from './types';

const Contacts: FC<IContractSettings> = ({ contacts, addContactLabel, handleSelect }) => {
  return (
    <div className={styles.contacts}>
      {Object.keys(contacts).length === 0 && (
        <div className={styles.actions}>
          <span>{addContactLabel}</span>
        </div>
      )}
      <ul className={styles.list}>
        {Object.values(contacts).map((contact: IContactState) => (
          <li onClick={() => handleSelect(contact.id)} key={contact.id}>
            <div className={styles.contact}>
              <span className={styles.info}>
                <Avatar address={contact.address} size={20} />
                <div>
                  {contact.name}
                  <small>{contact.address}</small>
                </div>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
