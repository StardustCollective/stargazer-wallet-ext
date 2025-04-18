///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Types
///////////////////////

import { IFiatAssetState } from 'state/price/types';
import { AssetType } from 'state/vault/types';
import IAssetItem from './types';
import FlagsSelectors from 'selectors/flagsSelectors';
import VaultSelectors from 'selectors/vaultSelectors';
import PriceSelectors from 'selectors/priceSelectors';

///////////////////////
// Scene
///////////////////////

import AssetItem from './AssetItem';
import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';
import useNetworkLabel from 'hooks/useNetworkLabel';

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

  const loadingDAGBalances = useSelector(FlagsSelectors.getLoadingDAGBalances);
  const loadingETHBalances = useSelector(FlagsSelectors.getLoadingETHBalances);

  // Sometimes the assetInfo is undefined after the Migration process.
  // This issue could be related to a race condition.
  if (!assetInfo) return null;

  const networkLabel = useNetworkLabel(assetInfo);

  const assetPrice: IFiatAssetState = useSelector(
    PriceSelectors.getAssetPrice(assetInfo.priceId)
  );
  const balance = useSelector(VaultSelectors.getAssetBalance(assetInfo.id));
  const balanceValue = formatStringDecimal(formatNumber(Number(balance), 16, 20), 4);

  const loading =
    assetInfo.type === AssetType.Constellation ? loadingDAGBalances : loadingETHBalances;
  return (
    <AssetItem
      id={id}
      asset={asset}
      assetInfo={assetInfo}
      itemClicked={itemClicked}
      balance={balanceValue}
      assetPrice={assetPrice}
      showNetwork={showNetwork}
      showPrice={showPrice}
      loading={loading}
      networkLabel={networkLabel}
    />
  );
};

export default AssetItemContainer;
