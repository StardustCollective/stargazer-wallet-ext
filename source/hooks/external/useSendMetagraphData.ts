import { useState } from 'react';
import { useSelector } from 'react-redux';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { ISendMetagraphDataParams } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { useExternalRequest, type UseExternalRequestReturn } from './useExternalRequest';

export interface UseSendMetagraphDataReturn extends UseExternalRequestReturn<ISendMetagraphDataParams>, BaseExternalRequestHook<ISendMetagraphDataParams> {
  asset: IAssetInfoState;
  fee: { fee: string; address: string; updateHash: string } | null;
  setFee: (fee: { fee: string; address: string; updateHash: string } | null) => void;
}

/**
 * Custom hook that extends useExternalRequest for send metagraph data operations
 */
export const useSendMetagraphData = (): UseSendMetagraphDataReturn => {
  const baseHook = useExternalRequest<ISendMetagraphDataParams>('Send metagraph data');

  const [fee, setFee] = useState<{ fee: string; address: string; updateHash: string } | null>(null);

  const metagraphId = baseHook?.decodedData?.metagraphId ?? null;
  const asset = useSelector(assetsSelectors.getAssetByAddress(metagraphId));

  return {
    ...baseHook,
    asset,
    fee,
    setFee,
  };
};
