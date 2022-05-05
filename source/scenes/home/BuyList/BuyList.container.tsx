///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
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
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <BuyList />
    </Container>
  );
};

export default BuyListContainer;
