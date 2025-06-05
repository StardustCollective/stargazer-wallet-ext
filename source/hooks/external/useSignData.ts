import { useMemo } from 'react';

import { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { ISignDataParams } from 'scripts/Provider/constellation';

import { decodeFromBase64 } from 'utils/encoding';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseSignDataReturn extends UseExternalRequestReturn<ISignDataParams>, BaseExternalRequestHook<ISignDataParams> {
  parsedPayload: any | null;
  decodedPayload: string;
}

/**
 * Custom hook that extends useExternalRequest for sign data operations
 */
export const useSignData = (): UseSignDataReturn => {
  const baseHook = useExternalRequest<ISignDataParams>('Sign data');

  // Decode the payload
  const decodedPayload = useMemo(() => {
    if (!baseHook?.decodedData?.payload) return '';
    return decodeFromBase64(baseHook.decodedData.payload);
  }, [baseHook?.decodedData?.payload]);

  // Parse and validate payload
  const parsedPayload = useMemo((): any | null => {
    if (!decodedPayload) return null;

    try {
      // Try to parse as JSON and pretty-print if successful
      const parsedData = JSON.parse(decodedPayload);
      return parsedData ? JSON.stringify(parsedData, null, 4) : null;
    } catch (error) {
      // Not valid JSON, return the raw decoded payload
      return decodedPayload;
    }
  }, [decodedPayload]);

  return {
    ...baseHook,
    parsedPayload,
    decodedPayload,
  };
};
