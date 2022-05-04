///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';
import BuyList from './BuyList';

///////////////////////////
// Types
///////////////////////////

import { IBuyListContainer } from './types';

const BuyListContainer: FC<IBuyListContainer> = ({ navigation, route }) => {
  console.log(navigation, route);

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false}>
      <BuyList />
    </Container>
  );
};

export default BuyListContainer;
