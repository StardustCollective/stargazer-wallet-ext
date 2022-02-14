///////////////////////
// Module
///////////////////////

import React from 'react';

import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////
// Components
///////////////////////

import Container from 'components/Container';

///////////////////////
// Selectors
///////////////////////

// import { useController } from 'hooks/index';
import walletSelectors from 'selectors/walletsSelectors';

///////////////////////
// Scene
///////////////////////

import AssetsPanel from './AssetsPanel';

///////////////////////
// Types
///////////////////////

import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import { INFTInfoState, INFTListState } from 'state/nfts/types';
import IAssetListState from 'state/assets/types';

///////////////////////
// Container
///////////////////////

const AssetsPanelContainer = () => {

  // const controller = useController();

  ///////////////////////
  // Hooks
  ///////////////////////

  const linkTo = useLinkTo();
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const nfts: INFTListState = useSelector((state: RootState) => state.nfts);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const activeNFTAssets = useSelector(walletSelectors.selectNFTAssets);

  console.log('!!!!!!!Active Wallet: ');
  console.log(activeWallet);

  ///////////////////////
  // Callbacks
  ///////////////////////

  const handleSelectAsset = (asset: IAssetState) => {
    // controller.wallet.account.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  const handleSelectNFT = (nft: INFTInfoState) => {
    window.open(nft.link, '_blank');
  };

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <>
      <AssetsPanel
        activeNetworkAssets={activeNetworkAssets}
        assets={assets}
        activeNFTAssets={activeNFTAssets}
        nfts={nfts}
        activeWallet={activeWallet}
        handleSelectAsset={handleSelectAsset}
        handleSelectNFT={handleSelectNFT}
      />
    </>
  );

}

export default AssetsPanelContainer;