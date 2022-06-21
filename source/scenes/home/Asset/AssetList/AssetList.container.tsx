///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import AssetList from './AssetList';

const AssetListContainer: FC = () => {

  const handleAddCustomToken = async () => {
    console.log('Navigate to Add custom token');
  };

  const constellationAssets: any[] = [];
  const erc20Assets: any[] = [];

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <AssetList 
        constellationAssets={constellationAssets}  
        erc20Assets={erc20Assets}
        handleAddCustomToken={handleAddCustomToken} />
    </Container>
  );
};

export default AssetListContainer;
