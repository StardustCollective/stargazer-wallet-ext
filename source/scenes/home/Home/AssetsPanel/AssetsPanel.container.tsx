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
import { INFTListState } from 'state/nfts/types';
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
  const nfts: INFTListState = useSelector((state: RootState) => state.nfts);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const activeNFTAssets = useSelector(walletSelectors.selectNFTAssets);

  ///////////////////////
  // Callbacks
  ///////////////////////

  const handleSelectAsset = (asset: IAssetState) => {
    accountController.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <AssetsPanel
      activeNetworkAssets={activeNetworkAssets}
      assets={assets}
      activeNFTAssets={activeNFTAssets}
      nfts={nfts}
      activeWallet={activeWallet}
      handleSelectAsset={handleSelectAsset}
    />
  );
};

export default AssetsPanelContainer;
