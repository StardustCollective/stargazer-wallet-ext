import type { DelegatedStake } from '@stardust-collective/dag4-network';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseDelegatedStakeReturn extends UseExternalRequestReturn<DelegatedStake>, BaseExternalRequestHook<DelegatedStake> {}

/**
 * Custom hook that extends useExternalRequest for delegated stake operations
 */
export const useDelegatedStake = (): UseDelegatedStakeReturn => {
  const baseHook = useExternalRequest<DelegatedStake>('Delegated stake');

  return {
    ...baseHook,
  };
};
