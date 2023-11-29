///////////////////////
// Module
///////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////
// Selectors
///////////////////////

import walletSelectors from 'selectors/walletsSelectors';

///////////////////////
// Utils
///////////////////////

import { getAccountController } from 'utils/controllersUtils';

///////////////////////
// Types
///////////////////////

import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

///////////////////////
// Scene
///////////////////////

import AssetsPanel from './AssetsPanel';

///////////////////////
// Container
///////////////////////

const AssetsPanelContainer: FC = () => {
  const accountController = getAccountController();

  ///////////////////////
  // Hooks
  ///////////////////////

  const linkTo = useLinkTo();
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);

  ///////////////////////
  // Callbacks
  ///////////////////////

  const handleSelectAsset = (asset: IAssetState) => {
    accountController.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  const handleAddTokens = () => {
    linkTo('/asset/add');
  };

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <AssetsPanel
      activeNetworkAssets={activeNetworkAssets}
      assets={assets}
      activeWallet={activeWallet}
      handleSelectAsset={handleSelectAsset}
      handleAddTokens={handleAddTokens}
    />
  );
};

export default AssetsPanelContainer;
