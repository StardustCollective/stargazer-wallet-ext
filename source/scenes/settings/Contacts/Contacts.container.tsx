import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'state/store';
import { useLinkTo } from '@react-navigation/native';
import addHeader from 'navigation/headers/add';

import IContactBookState from 'state/contacts/types';

import Container from 'components/Container';

import Contacts from './Contacts';

import { IContactsView } from './types';

const ContactsContainer: FC<IContactsView> = ({ navigation }) => {
  const addContactLabel = 'Please click the "+" to add a contact.';

  const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);

  const linkTo = useLinkTo();

  const handleSelect = (id: string) => {
    linkTo(`/settings/contacts/info?selected=${id}`);
  };

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/setting/contacts/modify?type=add');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  return (
    <Container safeArea={false}>
      <Contacts
        contacts={contacts}
        handleSelect={handleSelect}
        addContactLabel={addContactLabel}
      />
    </Container>
  );
};

export default ContactsContainer;
