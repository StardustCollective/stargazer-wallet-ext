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
  // 349: New network should be added here.
  if ([AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(asset?.symbol as AssetSymbol)) {
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
