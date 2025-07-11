import { useMemo } from 'react';

import { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import type { MessagePayload, SignTypedDataParams } from 'scripts/Provider/evm';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export interface UseSignTypedDataReturn extends UseExternalRequestReturn<SignTypedDataParams>, BaseExternalRequestHook<SignTypedDataParams> {
  parsedPayload: MessagePayload | null;
}

/**
 * Custom hook that extends useExternalRequest for sign typed data operations
 */
export const useSignTypedData = (): UseSignTypedDataReturn => {
  const baseHook = useExternalRequest<SignTypedDataParams>('Sign typed data');

  // Parse and validate payload
  const parsedPayload = useMemo((): MessagePayload | null => {
    if (!baseHook.decodedData?.payload) return null;

    try {
      return JSON.parse(baseHook.decodedData.payload) as MessagePayload;
    } catch (error) {
      console.warn('Failed to parse typed data payload:', error);
      return null;
    }
  }, [baseHook.decodedData?.payload]);

  return {
    ...baseHook,
    parsedPayload,
  };
};
