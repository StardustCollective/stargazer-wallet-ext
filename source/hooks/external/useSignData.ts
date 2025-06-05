import { useCallback, useMemo } from 'react';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import type { ISignDataParams } from 'scripts/Provider/constellation';

import { decodeFromBase64 } from 'utils/encoding';

export interface SignDataData {
  requestMessage: StargazerRequestMessage;
  decodedData: ISignDataParams;
  parsedPayload: any | null;
  decodedPayload: string;
}

export interface UseSignDataReturn extends SignDataData {
  handleReject: () => Promise<void>;
  handleSuccess: (signature: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

/**
 * Custom hook that extracts and manages common sign data logic
 * Handles data extraction, rejection, success, and error scenarios
 */
export const useSignData = (): UseSignDataReturn => {
  // Extract and decode request data
  const { message: requestMessage, data: decodedData } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<ISignDataParams>(location.href);
  }, []);

  // Decode the payload
  const decodedPayload = useMemo(() => {
    if (!decodedData?.payload) return '';
    return decodeFromBase64(decodedData.payload);
  }, [decodedData?.payload]);

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

  // Common rejection handler
  const handleReject = useCallback(async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(new EIPRpcError('User rejected request', EIPErrorCodes.Rejected), requestMessage);
    window.close();
  }, [requestMessage]);

  // Common success handler
  const handleSuccess = useCallback(
    async (signature: string) => {
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseResult(signature, requestMessage);
      window.close();
    },
    [requestMessage]
  );

  // Common error handler
  const handleError = useCallback(
    async (error: unknown) => {
      console.error('Sign data error:', error);
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage]
  );

  return {
    requestMessage,
    decodedData,
    parsedPayload,
    decodedPayload,
    handleReject,
    handleSuccess,
    handleError,
  };
};
