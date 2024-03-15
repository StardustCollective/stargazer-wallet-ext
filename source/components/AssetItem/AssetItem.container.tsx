///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Types
///////////////////////

import { RootState } from 'state/store';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import IAssetItem from './types';

///////////////////////
// Scene
///////////////////////

import AssetItem from './AssetItem';

///////////////////////
// Constants
///////////////////////

///////////////////////
// Container
///////////////////////

const AssetItemContainer: FC<IAssetItem> = ({
  id,
  asset,
  assetInfo,
  itemClicked,
  showNetwork = false,
  showPrice = false,
}) => {
  ///////////////////////
  // Hooks
  ///////////////////////

  const { balances, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  // Sometimes the assetInfo is undefined after the Migration process.
  // This issue could be related to a race condition.
  if (!assetInfo) return null;

  return (
    <AssetItem
      id={id}
      asset={asset}
      assetInfo={assetInfo}
      itemClicked={itemClicked}
      balances={balances}
      fiat={fiat}
      showNetwork={showNetwork}
      showPrice={showPrice}
      activeNetwork={activeNetwork}
    />
  );
};

export default AssetItemContainer;
