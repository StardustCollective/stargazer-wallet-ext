import { useMemo } from 'react';

import { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { ISignMessageParams, StargazerSignatureRequest } from 'scripts/Provider/constellation';

import { decodeFromBase64 } from 'utils/encoding';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseSignMessageReturn extends UseExternalRequestReturn<ISignMessageParams>, BaseExternalRequestHook<ISignMessageParams> {
  parsedPayload: StargazerSignatureRequest | null;
}

/**
 * Custom hook that extends useExternalRequest for sign message operations
 */
export const useSignMessage = (): UseSignMessageReturn => {
  const baseHook = useExternalRequest<ISignMessageParams>('Sign message');

  // Parse and validate payload
  const parsedPayload = useMemo((): StargazerSignatureRequest | null => {
    if (!baseHook.decodedData?.payload) return null;

    try {
      const decodedPayload = decodeFromBase64(baseHook.decodedData.payload);
      return JSON.parse(decodedPayload) as StargazerSignatureRequest;
    } catch (error) {
      console.warn('Failed to parse payload:', error);
      return null;
    }
  }, [baseHook.decodedData?.payload]);

  return {
    ...baseHook,
    parsedPayload,
  };
};
