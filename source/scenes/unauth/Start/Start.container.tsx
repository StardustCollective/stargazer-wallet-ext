///////////////////////////
// Imports
///////////////////////////

import React from 'react';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

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
    <Container color={CONTAINER_COLOR.DARK} maxHeight={false}>
      <Start
        navigation={navigation}
        onImportClicked={onImportClicked}
        onGetStartedClicked={onGetStartedClicked}
      />
    </Container>
  );
};

export default StartContainer;
