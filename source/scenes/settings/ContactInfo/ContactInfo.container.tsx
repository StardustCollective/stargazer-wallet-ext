import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

import { useCopyClipboard } from 'hooks/index';
import ContactsController from 'scripts/Background/controllers/ContactsController';
import IContactBookState from 'state/contacts/types';
import { RootState } from 'state/store';

import Container from 'scenes/common/Container';

import ContactInfo from './ContactInfo';

import { IContactInfoView } from './types';

const ContactInfoContainer: FC<IContactInfoView> = ({ route, navigation }) => {
  const linkTo = useLinkTo();

  const [codeOpened, setCodeOpened] = useState(false);
  const [isCopied, copyText] = useCopyClipboard();

  const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);

  const selectedContactId = route?.params?.selected;

  const handleDelete = () => {
    ContactsController.deleteContact(selectedContactId);
    navigation.goBack();
  };

  const handleEdit = () => {
    linkTo(`/setting/contacts/modify?selected=${selectedContactId}&type=edit`);
  };

  return (
    <Container>
      <ContactInfo
        codeOpened={codeOpened}
        setCodeOpened={setCodeOpened}
        isCopied={isCopied}
        copyText={copyText}
        contacts={contacts}
        selectedContactId={selectedContactId}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </Container>
  );
};

export default ContactInfoContainer;
