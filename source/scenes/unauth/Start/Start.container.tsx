///////////////////////////
// Imports
///////////////////////////

import React, { useCallback } from 'react';
import { useFocusEffect, useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import { getWalletController } from 'utils/controllersUtils';

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

  // Drop any seed phrase left over from an abandoned onboarding
  useFocusEffect(
    useCallback(() => {
      getWalletController().onboardHelper.reset();
    }, [])
  );

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
