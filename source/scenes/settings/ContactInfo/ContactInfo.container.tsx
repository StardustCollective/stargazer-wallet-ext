import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

// import { useController, useCopyClipboard } from 'hooks/index';
import IContactBookState from 'state/contacts/types';
import { RootState } from 'state/store';

import Container from 'scenes/common/Container';

import ContactInfo from './ContactInfo';

import { IContactInfoView } from './types';

const ContactInfoContainer: FC<IContactInfoView> = ({ route, navigation }) => {
  // const controller = useController();
  const linkTo = useLinkTo();

  const [codeOpened, setCodeOpened] = useState(false);
  // const [isCopied, copyText] = useCopyClipboard();
  const [isCopied, copyText] = useState(false);

  // const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);
  const contacts = {
    trini: {
      id: 'trini',
      name: 'Trini',
      address: '0xa49706472Af0Daa902459917eB56ccB3085DF040',
      memo: 'I am trini what is your contact',
    },
    gussy: {
      id: 'gussy',
      name: 'Gussy',
      address: '0xa49706472Af0Daa902459917eB56ccB3085DF040',
      memo: 'I am guster what is your contact',
    },
  };

  const selectedContactId = route?.params?.selected || 'trini';

  console.log('selectedContactId', selectedContactId);

  const handleDelete = () => {
    // controller.contacts.deleteContact(selectedContactId);
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
