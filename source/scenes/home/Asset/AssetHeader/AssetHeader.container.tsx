import React, { FC } from 'react';

import AssetHeader from './AssetHeader';

import { IAssetHeader } from './types';
import { getNetworkFromChainId, getNetworkLabel } from 'scripts/Background/controllers/EVMChainController/utils';
import IVaultState from 'state/vault/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';

const AssetHeaderContainer: FC<IAssetHeader> = ({ asset }) => {
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  let network = asset?.network;
  
  if (['ETH', 'AVAX', 'BNB', 'MATIC'].includes(asset?.symbol)) {
    const currentNetwork = getNetworkFromChainId(network);
    network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
  }

  const networkLabel = getNetworkLabel(network, asset?.symbol);

  return (
    <AssetHeader
      network={networkLabel}
      asset={asset}
    />
  );
};

export default AssetHeaderContainer;
