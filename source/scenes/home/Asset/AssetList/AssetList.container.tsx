///////////////////////////
// Modules
///////////////////////////

import React, { FC, useLayoutEffect, useState, useEffect } from 'react';
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
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import  { IAssetListContainer } from './types';
import { getAccountController } from 'utils/controllersUtils';

const AssetListContainer: FC<IAssetListContainer> = ({ navigation }) => {

  const linkTo = useLinkTo();
  const { constellationAssets, erc20assets, loading, error }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const [allAssets, setAllAssets] = useState([{ title: 'Constellation Ecosystem', data: constellationAssets || [] }, { title: 'All ERC-20 Tokens', data: erc20assets || [] }]);
  const [searchValue, setSearchValue] = useState('');
  const accountController = getAccountController();

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/asset/addCustom');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  useEffect(() => {
    const newAssetsArray = [
      allAssets[0],
      {
        ...allAssets[1],
        data: erc20assets || [],
      }
    ]
    setAllAssets(newAssetsArray);
  }, [erc20assets])

  const onSearch = (event: any) => {
    const text = event.nativeEvent.text;
    const textLowerCase = text.toLowerCase();
    const newAssetsArray = [
      {
        ...allAssets[0],
        data: constellationAssets.filter(item => item.label.toLowerCase().includes(textLowerCase) || item.symbol.toLowerCase().includes(textLowerCase)),
      },
      {
        ...allAssets[1],
        data: erc20assets.filter(item => item.label.toLowerCase().includes(textLowerCase) || item.symbol.toLowerCase().includes(textLowerCase)),
      }
    ]
    setAllAssets(newAssetsArray);
    setSearchValue(text);
  }
  

  const toggleAssetItem = async (assetInfo: IAssetInfoState, value: boolean) => {
    const contractAddress = assetInfo.address;
    const assetExists = !!assets[contractAddress];
    if (value) {
      // Add asset
      if (!assetExists) {
        accountController.assetsController.addERC20AssetFn(assetInfo);
      }
    } else {
      // Remove asset
      if (assetExists) {
        accountController.assetsController.removeERC20AssetFn(assetInfo);
      }
    }
  } 

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <AssetList 
        assets={assets}
        allAssets={allAssets}
        loading={loading}
        searchValue={searchValue}
        toggleAssetItem={toggleAssetItem}
        onSearch={onSearch}
      />
    </Container>
  );
};

export default AssetListContainer;
