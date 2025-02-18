import React, { FC } from 'react';
import AssetHeader from './AssetHeader';
import { IAssetHeader } from './types';
import useNetworkLabel from 'hooks/useNetworkLabel';

const AssetHeaderContainer: FC<IAssetHeader> = ({ asset }) => {
  const networkLabel = useNetworkLabel(asset);

  return <AssetHeader network={networkLabel} asset={asset} />;
};

export default AssetHeaderContainer;
