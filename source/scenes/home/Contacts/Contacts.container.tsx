import React, { FC } from 'react';
import Container from 'components/Container';
import Contacts from './Contacts';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IContactBookState, { IContactState } from 'state/contacts/types';
import IVaultState, { AssetType } from 'state/vault/types';

import { getAccountController } from 'utils/controllersUtils';
import IWalletContacts from './types';

const ContactContainer: FC<IWalletContacts> = ({ open, onClose, onChange }) => {
  const accountController = getAccountController();

  const { activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);

  const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);

  const isDAGAddress = (address: string) => {
    return accountController.isValidDAGAddress(address);
  };

  const isValidContact = (contact: IContactState) => {
    return (
      (activeAsset.type === AssetType.Constellation && isDAGAddress(contact.address)) ||
      (activeAsset.type !== AssetType.Constellation && !isDAGAddress(contact.address))
    );
  };

  return (
    <Container>
      <Contacts
        open={open}
        onClose={onClose}
        onChange={onChange}
        contacts={contacts}
        isValidContact={isValidContact}
      />
    </Container>
  );
};

export default ContactContainer;
