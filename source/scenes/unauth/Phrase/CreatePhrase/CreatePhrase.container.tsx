///////////////////////////
// Modules
///////////////////////////

import React, { useState } from 'react';
import { useLinkTo } from '@react-navigation/native';


///////////////////////////
// Component
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Scene
///////////////////////////

import CreatePhrase from './CreatePhrase';

///////////////////////////
// Controller
///////////////////////////

// import Controller from 'scripts/Background/controllers';

///////////////////////////
// Container
///////////////////////////

import * as consts from '../consts';

const CreatePhraseContainer = () => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const [passed, setPassed] = useState(false);
  // const controller = Controller();

  ///////////////////////////
  // Strings
  ///////////////////////////

  const title = passed
    ? consts.CREATE_PHRASE_TITLE2
    : consts.CREATE_PHRASE_TITLE1;
  const description = passed
    ? consts.CREATE_PHRASE_DESCRIPTION2
    : consts.CREATE_PHRASE_DESCRIPTION1;

  // const phrases = controller.wallet.onboardHelper.getSeedPhrase();
  const phrases = 'wave squeeze stamp film work eyebrow resist balance strong danger street economy';

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
    <Container>
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
