///////////////////////////
// Modules  
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

import RemindPhrase from './RemindPhrase';

///////////////////////////
// Container  
///////////////////////////

const RemindPhraseContainer = () => {

  ///////////////////////////
  // Hooks  
  ///////////////////////////

  const linkTo = useLinkTo();

  ///////////////////////////
  // Callbacks  
  ///////////////////////////

  const nextHandler = () => {
    linkTo('/create/phrase/generated');
  }

  ///////////////////////////
  // Render  
  ///////////////////////////

  return (
    <Container>
      <RemindPhrase
        nextHandler={nextHandler}
      />
    </Container>
  )
}

export default RemindPhraseContainer;