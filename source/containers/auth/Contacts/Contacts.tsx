import React, { FC } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Avatar from '@devneser/gradient-avatar';
import Portal from '@reach/portal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { RootState } from 'state/store';
import { useController } from 'hooks/index';
import IContactBookState, { IContactState } from 'state/contacts/types';
import IWalletState, { AssetType } from 'state/wallet/types';

import styles from './Contacts.scss';

interface IWalletContacts {
  open: boolean;
  onClose?: () => void;
  onChange: (address: string) => void;
}

const WalletContacts: FC<IWalletContacts> = ({ open, onClose, onChange }) => {
  const controller = useController();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const contacts: IContactBookState = useSelector(
    (state: RootState) => state.contacts
  );
  const account = accounts[activeAccountId];

  const isDAGAddress = (address: string) => {
    return controller.wallet.account.isValidDAGAddress(address);
  };

  const isValidContact = (contact: IContactState) => {
    return (
      (account.activeAssetId === AssetType.Constellation &&
        isDAGAddress(contact.address)) ||
      (account.activeAssetId !== AssetType.Constellation &&
        !isDAGAddress(contact.address))
    );
  };

  return (
    <Portal>
      <div className={clsx(styles.mask, { [styles.open]: open })}>
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
                  <li
                    key={contact.id}
                    onClick={() => onChange(contact.address)}
                  >
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
