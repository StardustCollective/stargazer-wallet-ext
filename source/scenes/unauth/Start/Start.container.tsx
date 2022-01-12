import React from 'react';
import { useLinkTo } from '@react-navigation/native';

import Container from 'components/Container';


import Start from './Start';

const StartContainer = () => {
  const linkTo = useLinkTo();

  const onImportClicked = () => {
    linkTo('/import');
  }

  const onGetStartedClicked = () => {
    linkTo('/create/pass');
  }

  return (
    <Container>
      <Start 
        onImportClicked={onImportClicked}
        onGetStartedClicked={onGetStartedClicked}
      />
    </Container>
  );
}

export default StartContainer;