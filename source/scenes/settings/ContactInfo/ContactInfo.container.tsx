import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

import { useCopyClipboard } from 'hooks/index';
import IContactBookState from 'state/contacts/types';
import { RootState } from 'state/store';

import Container from 'components/Container';

import ContactInfo from './ContactInfo';

import { IContactInfoView } from './types';
import { getContactsController } from 'utils/controllersUtils';

const ContactInfoContainer: FC<IContactInfoView> = ({ route, navigation }) => {
  const linkTo = useLinkTo();

  const contactsController = getContactsController();
  const [codeOpened, setCodeOpened] = useState(false);
  const [isCopied, copyText] = useCopyClipboard();

  const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);

  const selectedContactId = route.params.selected;

  const contact = contacts[selectedContactId];

  const handleDelete = () => {
    contactsController.deleteContact(selectedContactId);
    navigation.goBack();
  };

  const handleEdit = () => {
    linkTo(`/setting/contacts/modify?selected=${selectedContactId}&type=edit`);
  };

  return (
    <Container safeArea={false}>
      <ContactInfo
        codeOpened={codeOpened}
        setCodeOpened={setCodeOpened}
        isCopied={isCopied}
        copyText={copyText}
        contact={contact}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </Container>
  );
};

export default ContactInfoContainer;
