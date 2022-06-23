///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import AddCustomAsset from './AddCustomAsset';

const AddCustomAssetContainer: FC = () => {

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <AddCustomAsset />
    </Container>
  );
};

export default AddCustomAssetContainer;
