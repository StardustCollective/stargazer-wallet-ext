import { useCallback, useMemo } from 'react';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import type { ISignMessageParams, StargazerSignatureRequest } from 'scripts/Provider/constellation';

import { decodeFromBase64 } from 'utils/encoding';

export interface SignMessageData {
  requestMessage: StargazerRequestMessage;
  decodedData: ISignMessageParams;
  parsedPayload: StargazerSignatureRequest | null;
  isDagSignature: boolean;
}

export interface UseSignMessageReturn extends SignMessageData {
  handleReject: () => void;
  handleSuccess: (signature: string) => void;
  handleError: (error: unknown) => void;
}

/**
 * Custom hook that extracts and manages common sign message logic
 * Handles data extraction, rejection, success, and error scenarios
 */
export const useSignMessage = (): UseSignMessageReturn => {
  // Extract and decode request data
  const { message: requestMessage, data: decodedData } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<ISignMessageParams>(location.href);
  }, []);

  // Parse and validate payload
  const parsedPayload = useMemo((): StargazerSignatureRequest | null => {
    if (!decodedData?.payload) return null;

    try {
      const decodedPayload = decodeFromBase64(decodedData.payload);
      return JSON.parse(decodedPayload) as StargazerSignatureRequest;
    } catch (error) {
      console.warn('Failed to parse payload:', error);
      return null;
    }
  }, [decodedData?.payload]);

  // Determine signature type
  const isDagSignature = useMemo(() => {
    return decodedData?.asset === 'DAG';
  }, [decodedData?.asset]);

  // Common rejection handler
  const handleReject = useCallback(() => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(new EIPRpcError('User rejected request', EIPErrorCodes.Rejected), requestMessage);
    window.close();
  }, [requestMessage]);

  // Common success handler
  const handleSuccess = useCallback(
    (signature: string) => {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(signature, requestMessage);
      window.close();
    },
    [requestMessage]
  );

  // Common error handler
  const handleError = useCallback(
    (error: unknown) => {
      console.error('Sign message error:', error);
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage]
  );

  return {
    requestMessage,
    decodedData,
    parsedPayload,
    isDagSignature,
    handleReject,
    handleSuccess,
    handleError,
  };
};
