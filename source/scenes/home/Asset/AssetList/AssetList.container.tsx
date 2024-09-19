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
import { IAssetListContainer } from './types';
import IVaultState from 'state/vault/types';

const AssetListContainer: FC<IAssetListContainer> = ({ navigation }) => {
  const linkTo = useLinkTo();
  const {
    constellationAssets,
    erc20assets,
    searchAssets,
    loading,
  }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  const { activeWallet, activeNetwork, customAssets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const activeNetworkAssets = useSelector(walletsSelectors.selectActiveNetworkAssets);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const [allAssets, setAllAssets] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const accountController = getAccountController();

  const filterArrayByValue = (
    array: IAssetInfoState[],
    value: string
  ): IAssetInfoState[] => {
    return array?.filter(
      (item) =>
        item?.label?.toLowerCase()?.includes(value) ||
        item?.symbol?.toLowerCase()?.includes(value)
    );
  };

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/asset/addCustom');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  useEffect(() => {
    const getERC20Assets = async () => {
      await accountController.assetsController.fetchERC20Assets();
    };
    if (!erc20assets) {
      getERC20Assets();
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setCustomLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    let constellation = constellationAssets;
    let erc20 = erc20assets;
    let search = searchAssets;
    let all: IAssetInfoState[] = [];

    if (searchValue) {
      const searchLowerCase = searchValue?.toLocaleLowerCase();
      constellation = constellation.concat(customAssets);
      constellation = filterArrayByValue(constellation, searchLowerCase);
      all = constellation;
      if (search) {
        all = constellation.concat(search);
      }
    } else {
      all = constellation.concat(customAssets).concat(erc20);

      if (searchAssets?.length) {
        accountController.assetsController.clearSearchAssets();
      }
    }

    setAllAssets(all);
  }, [erc20assets?.length, searchAssets?.length, searchValue]);

  useEffect(() => {
    const searchAssets = async (value: string) => {
      await accountController.assetsController.searchERC20Assets(value);
    };
    if (debouncedSearchTerm) {
      searchAssets(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const onSearch = (text: string) => {
    const isLoading = !!text;
    setCustomLoading(isLoading);
    setSearchValue(text);
  };

  const toggleAssetItem = async (assetInfo: IAssetInfoState, value: boolean) => {
    const assetId = assetInfo.id;
    const assetExists = !!assets[assetId];
    if (value) {
      // Add asset
      if (!assetExists) {
        accountController.assetsController.addAssetFn(assetInfo);
      }
    } else {
      // Remove asset
      if (assetExists) {
        accountController.assetsController.removeERC20AssetFn(assetInfo);
      }
    }
  };

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
