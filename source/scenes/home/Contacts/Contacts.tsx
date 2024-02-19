import React, { FC } from 'react';
import clsx from 'clsx';
import Avatar from '@devneser/gradient-avatar';
import Portal from '@reach/portal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { IContactState } from 'state/contacts/types';

import styles from './Contacts.scss';

import IWalletContacts from './types';

const WalletContacts: FC<IWalletContacts> = ({
  open,
  onClose,
  onChange,
  contacts,
  isValidContact,
}) => {
  let isExternalRequest = false;

  if (!!location) {
    isExternalRequest = location.pathname.includes('sendTransaction');
  }

  return (
    <Portal>
      <div
        className={clsx(styles.mask, {
          [styles.open]: open,
          [styles.removeTop]: isExternalRequest,
        })}
      >
        <div className={styles.modal}>
          <section className={styles.heading}>
            <span className={styles.title}>Contacts</span>
            <IconButton
              className={clsx(styles.navBtn, styles.closeBtn)}
              onClick={onClose}
            >
              <CloseIcon className={styles.icon} />
            </IconButton>
          </section>
          <section className={styles.container}>
            <ul className={styles.list}>
              {Object.values(contacts)
                .filter(isValidContact)
                .map((contact: IContactState) => (
                  <li key={contact.address} onClick={() => onChange(contact.address)}>
                    <div className={styles.contact}>
                      <span className={styles.info}>
                        {/* <Icon Component={UserIcon} /> */}
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
          </section>
        </div>
      </div>
    </Portal>
  );
};

export default WalletContacts;
