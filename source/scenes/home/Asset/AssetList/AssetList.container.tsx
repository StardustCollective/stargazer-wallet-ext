///////////////////////////
// Modules
///////////////////////////

import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import AssetList from './AssetList';

///////////////////////////
// Navigation
///////////////////////////

import addHeader from 'navigation/headers/add';

///////////////////////////
// Types
///////////////////////////

import IERC20AssetsListState from 'state/erc20assets/types';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';
import  { IAssetListContainer } from './types';

const AssetListContainer: FC<IAssetListContainer> = ({ navigation }) => {

  const linkTo = useLinkTo();
  const { constellationAssets, erc20assets, loading, error }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/asset/addCustom');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  const toggleAssetItem = (assetInfo: any, value: boolean) => {
    if (value) {
      // Add to assets
    } else {
      // Remove from assets
    }
    console.log('toggleAssetItem', assetInfo, value);
  } 

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <AssetList 
        assets={assets}
        loading={loading}
        constellationAssets={constellationAssets.slice(0, 2000)}  
        erc20assets={erc20assets}
        toggleAssetItem={toggleAssetItem}
      />
    </Container>
  );
};

export default AssetListContainer;
