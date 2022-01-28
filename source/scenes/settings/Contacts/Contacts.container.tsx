///////////////////////
// Modules
///////////////////////
import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Components
///////////////////////

import Container from 'scenes/common/Container';

///////////////////////
// Scene
///////////////////////

import Contacts from './Contacts';

///////////////////////
// Hooks
///////////////////////
import { RootState } from 'state/store';
import { useLinkTo } from '@react-navigation/native';
import addHeader from 'navigation/headers/add';

///////////////////////
// Types
///////////////////////
import IContactBookState from 'state/contacts/types';
import { IContactsView } from './types';

///////////////////////
// Component
///////////////////////

const ContactsContainer: FC<IContactsView> = ({ navigation }) => {
  ///////////////////////
  // Constants
  ///////////////////////
  const addContactLabel = 'Please click the "+" to add a contact.';
  ///////////////////////
  // Hooks
  ///////////////////////
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

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <Container>
      <Contacts contacts={contacts} handleSelect={handleSelect} addContactLabel={addContactLabel} />
    </Container>
  );
};

export default ContactsContainer;
