import React, { FC } from 'react';

import AssetHeader from './AssetHeader';

import { IAssetHeader } from './types';
import { getNetworkLabel } from 'scripts/Background/controllers/EVMChainController/utils';

const AssetHeaderContainer: FC<IAssetHeader> = ({ asset }) => {
  const network = asset?.symbol === 'DAG' ? 'Constellation' : getNetworkLabel(asset?.network);

  return (
    <AssetHeader
      network={network}
      asset={asset}
    />
  );
};

export default AssetHeaderContainer;
