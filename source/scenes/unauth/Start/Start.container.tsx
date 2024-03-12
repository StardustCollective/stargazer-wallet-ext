///////////////////////////
// Imports
///////////////////////////

import React from 'react';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Scene
///////////////////////////

import Start from './Start';

///////////////////////////
// Container
///////////////////////////

const StartContainer = ({ navigation }: { navigation: any }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const onImportClicked = () => {
    linkTo('/import');
  };

  const onGetStartedClicked = () => {
    linkTo('/create/pass');
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container maxHeight={false}>
      <Start
        navigation={navigation}
        onImportClicked={onImportClicked}
        onGetStartedClicked={onGetStartedClicked}
      />
    </Container>
  );
};

export default StartContainer;
