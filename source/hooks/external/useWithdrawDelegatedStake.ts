import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseWithdrawDelegatedStakeReturn extends UseExternalRequestReturn<WithdrawDelegatedStake>, BaseExternalRequestHook<WithdrawDelegatedStake> {}

/**
 * Custom hook that extends useExternalRequest for withdraw delegated stake operations
 */
export const useWithdrawDelegatedStake = (): UseWithdrawDelegatedStakeReturn => {
  const baseHook = useExternalRequest<WithdrawDelegatedStake>('Withdraw delegated stake');

  return {
    ...baseHook,
  };
};
