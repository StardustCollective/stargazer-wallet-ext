///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react'
import { useSelector } from 'react-redux';

///////////////////////
// Types
///////////////////////

import IAssetItem from './types';
import { RootState } from 'state/store';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';

///////////////////////
// Scene
///////////////////////

import AssetItem from './AssetItem';

///////////////////////
// Constants
///////////////////////

const isAssetNFT = (assetInfo: any) => {
  return [AssetType.ERC721, AssetType.ERC1155].includes(assetInfo.type);
};

///////////////////////
// Container
///////////////////////

const AssetItemContainer: FC<IAssetItem> = ({ id, asset, assetInfo, itemClicked, showNetwork = false }) => {

  ///////////////////////
  // Hooks
  ///////////////////////

  const { balances }: IVaultState = useSelector((state: RootState) => state.vault);
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);
  const isNFT = isAssetNFT(assetInfo);

  return (
    <AssetItem
      id={id}
      asset={asset}
      assetInfo={assetInfo}
      itemClicked={itemClicked}
      balances={balances}
      fiat={fiat}
      isNFT={isNFT}
      showNetwork={showNetwork}
    />
  )

}

export default AssetItemContainer;