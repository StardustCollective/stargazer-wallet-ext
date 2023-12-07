///////////////////////////
// Imports
///////////////////////////

import React, { FC, useLayoutEffect } from 'react';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Scene
///////////////////////////

import SingleSelect from './SingleSelect';

///////////////////////////
// Type
///////////////////////////

import { ISingleSelectContainer } from './types';

///////////////////////////
// Container
///////////////////////////

const SingleSelectContainer: FC<ISingleSelectContainer> = ({ navigation, route }) => {
  const { title, data, selected, onSelect } = route.params;

  ///////////////////////////
  // Hooks
  ///////////////////////////

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, []);

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <SingleSelect data={data} selected={selected} onSelect={onSelect} />
    </Container>
  );
};

export default SingleSelectContainer;
