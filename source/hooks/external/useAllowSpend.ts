import { useState } from 'react';
import { useSelector } from 'react-redux';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { AllowSpendData } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';

import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import { toDag } from 'utils/number';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseAllowSpendReturn extends UseExternalRequestReturn<AllowSpendData>, BaseExternalRequestHook<AllowSpendData> {
  asset: IAssetInfoState;
  fee: string;
  setFee: (fee: string) => void;
}

/**
 * Custom hook that extends useExternalRequest for allow spend operations
 */
export const useAllowSpend = (): UseAllowSpendReturn => {
  const baseHook = useExternalRequest<AllowSpendData>('Allow spend');

  const currencyId = baseHook?.decodedData?.currencyId ?? null;
  const isDag = currencyId === null;
  const assetSelector = isDag ? assetsSelectors.getAssetById(AssetType.Constellation) : assetsSelectors.getAssetByAddress(currencyId);
  const asset = useSelector(assetSelector);

  const feeInDatum = baseHook.decodedData?.fee ?? 0;

  // Initialize fee state with default value from decoded data
  const [fee, setFee] = useState<string>(() => {
    return toDag(feeInDatum).toString();
  });

  return {
    ...baseHook,
    asset,
    fee,
    setFee,
  };
};
