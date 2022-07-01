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
import useDebounce from 'hooks/useDebounce';

const AssetListContainer: FC<IAssetListContainer> = ({ navigation }) => {

  const linkTo = useLinkTo();
  const { constellationAssets, erc20assets, customAssets, searchAssets, loading, error }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  console.log('Error:', error);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const [allAssets, setAllAssets] = useState(constellationAssets.concat(customAssets).concat(erc20assets));
  const [searchValue, setSearchValue] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const accountController = getAccountController();

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/asset/addCustom');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  useEffect(() => {
    if (!loading) {
      setCustomLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    let newDataArray = searchAssets?.length ? searchAssets : erc20assets;
    let constellationDataArray = constellationAssets.concat(customAssets);
    if (searchValue) {
      const searchLowerCase = searchValue.toLowerCase();
      newDataArray = searchAssets?.length ? searchAssets : erc20assets.filter(item => item.label.toLowerCase().includes(searchLowerCase) || item.symbol.toLowerCase().includes(searchLowerCase));
      constellationDataArray = constellationDataArray.filter(item => item.label.toLowerCase().includes(searchLowerCase) || item.symbol.toLowerCase().includes(searchLowerCase));
    } else {
      if (searchAssets?.length) {
        accountController.assetsController.clearSearchAssets();
      }
    }
    
    const newAssetsArray = constellationDataArray.concat(newDataArray);
    setAllAssets(newAssetsArray);
  }, [erc20assets, searchAssets, searchValue])

  useEffect(() => {
    const searchAssets = async (value: string) => {
      await accountController.assetsController.searchERC20Assets(value);
    }
    if (debouncedSearchTerm) {
      searchAssets(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const onSearch = (text: string) => {
    const isLoading = !!text;
    setCustomLoading(isLoading);
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
        loading={loading || customLoading}
        searchValue={searchValue}
        toggleAssetItem={toggleAssetItem}
        onSearch={onSearch}
      />
    </Container>
  );
};

export default AssetListContainer;
