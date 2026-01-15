import { useSelector } from 'react-redux';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';

import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseTokenLockReturn extends UseExternalRequestReturn<TokenLockDataParam>, BaseExternalRequestHook<TokenLockDataParam> {
  asset: IAssetInfoState;
  isUpdate: boolean;
}

/**
 * Custom hook that extends useExternalRequest for token lock operations
 */
export const useTokenLock = (): UseTokenLockReturn => {
  const baseHook = useExternalRequest<TokenLockDataParam>('Token lock');

  const currencyId = baseHook?.decodedData?.currencyId ?? null;
  const isDag = currencyId === null;
  const isUpdate = baseHook?.decodedData?.replaceTokenLockRef !== null;
  const assetSelector = isDag ? assetsSelectors.getAssetById(AssetType.Constellation) : assetsSelectors.getAssetByAddress(currencyId);
  const asset = useSelector(assetSelector);

  return {
    ...baseHook,
    asset,
    isUpdate
  };
};
