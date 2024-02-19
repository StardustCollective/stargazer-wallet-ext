///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import Container from 'components/Container';
import Security from './Security';

const SecurityContainer: FC = () => {
  return (
    <Container safeArea={false}>
      <Security />
    </Container>
  );
};

export default SecurityContainer;
