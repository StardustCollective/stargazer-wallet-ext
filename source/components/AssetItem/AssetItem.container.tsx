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
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetItem from './types';
import FlagsSelectors from 'selectors/flagsSelectors';

///////////////////////
// Scene
///////////////////////

import AssetItem from './AssetItem';

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
  const loadingDAGBalances = useSelector(FlagsSelectors.getLoadingDAGBalances);
  const loadingETHBalances = useSelector(FlagsSelectors.getLoadingETHBalances);
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  // Sometimes the assetInfo is undefined after the Migration process.
  // This issue could be related to a race condition.
  if (!assetInfo) return null;

  const loading =
    assetInfo.type === AssetType.Constellation ? loadingDAGBalances : loadingETHBalances;
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
      loading={loading}
    />
  );
};

export default AssetItemContainer;
