import React, { FC } from 'react';

import AssetHeader from './AssetHeader';

import { IAssetHeader } from './types';
import { getNetworkFromChainId, getNetworkLabel } from 'scripts/Background/controllers/EVMChainController/utils';
import IVaultState, { AssetSymbol } from 'state/vault/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';

const AssetHeaderContainer: FC<IAssetHeader> = ({ asset }) => {
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  let network = asset?.network;
  // TODO-349: Only Polygon and AVAX ['ETH', 'AVAX', 'BNB', 'MATIC']
  if ([AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX].includes(asset?.symbol as AssetSymbol)) {
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
