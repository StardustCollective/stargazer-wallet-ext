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
// Hooks
///////////////////////////

import useDebounce from 'hooks/useDebounce';

///////////////////////////
// Utils
///////////////////////////

import { getAccountController } from 'utils/controllersUtils';
import walletsSelectors from 'selectors/walletsSelectors';

///////////////////////////
// Types
///////////////////////////

import IERC20AssetsListState from 'state/erc20assets/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import  { IAssetListContainer } from './types';
import IVaultState from 'state/vault/types';

const AssetListContainer: FC<IAssetListContainer> = ({ navigation }) => {

  const linkTo = useLinkTo();
  const { constellationAssets, erc20assets, customAssets, searchAssets, loading, error }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  console.log('Error', error);
  const { activeWallet, activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const activeNetworkAssets = useSelector(walletsSelectors.selectActiveNetworkAssets);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  let filteredArray = constellationAssets?.concat(customAssets).concat(erc20assets);
  if (activeNetwork.Ethereum !== 'mainnet') {
    filteredArray = constellationAssets?.slice(0, 2);
  }
  const [allAssets, setAllAssets] = useState(filteredArray);
  const [searchValue, setSearchValue] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const accountController = getAccountController();

  const filterArrayById = (array: IAssetInfoState[]): IAssetInfoState[] => {
    return [...new Map(array.map((item: IAssetInfoState) => [item?.id, item])).values()];
  }

  const filterArrayByValue = (array: IAssetInfoState[], value: string): IAssetInfoState[] => {
    return array?.filter(item => item?.label?.toLowerCase()?.includes(value) || item?.symbol?.toLowerCase()?.includes(value));
  }

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
    let constellationDataArray = filteredArray?.concat(customAssets);
    if (searchValue) {
      const searchLowerCase = searchValue?.toLowerCase();
      newDataArray = searchAssets?.length ? searchAssets : filterArrayByValue(erc20assets, searchLowerCase);
      constellationDataArray = filterArrayByValue(constellationDataArray, searchLowerCase);
    } else {
      if (searchAssets?.length) {
        accountController.assetsController.clearSearchAssets();
      }
    }
    
    let newAssetsArray = constellationDataArray;
    if (activeNetwork.Ethereum === 'mainnet') {
      newAssetsArray = newAssetsArray?.concat(newDataArray);
    }
    newAssetsArray = filterArrayById(newAssetsArray);
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
    // TODO-349: Check if necessary
    // await accountController.assetsBalanceMonitor.start();
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
        activeWallet={activeWallet}
        activeNetworkAssets={activeNetworkAssets}
        activeNetwork={activeNetwork}
      />
    </Container>
  );
};

export default AssetListContainer;
