///////////////////////////
// Modules
///////////////////////////

import React, { useState } from 'react';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Component
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Scene
///////////////////////////

import CreatePhrase from './CreatePhrase';

///////////////////////////
// Container
///////////////////////////

import * as consts from '../consts';

///////////////////////////
// Container
///////////////////////////

const CreatePhraseContainer = () => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const [passed, setPassed] = useState(false);
  const walletController = getWalletController();
  const phrases = walletController.onboardHelper.getSeedPhrase();

  ///////////////////////////
  // Strings
  ///////////////////////////

  const title = passed ? consts.CREATE_PHRASE_TITLE2 : consts.CREATE_PHRASE_TITLE1;
  const description = passed ? consts.CREATE_PHRASE_DESCRIPTION2 : consts.CREATE_PHRASE_DESCRIPTION1;

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const nextHandler = () => {
    if (passed && phrases) {
      linkTo('/create/phrase/check');
    } else {
      setPassed(true);
    }
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT}>
      <CreatePhrase
        title={title}
        description={description}
        nextHandler={nextHandler}
        phrases={phrases}
        passed={passed}
      />
    </Container>
  );
};

export default CreatePhraseContainer;
