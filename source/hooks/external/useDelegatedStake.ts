import { useCallback, useMemo } from 'react';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import type { DelegatedStakeData } from 'scripts/Provider/constellation';

export interface DelegatedStakeHookData {
  requestMessage: StargazerRequestMessage;
  decodedData: DelegatedStakeData;
}

export interface UseDelegatedStakeReturn extends DelegatedStakeHookData {
  handleReject: () => Promise<void>;
  handleSuccess: (txHash: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

/**
 * Custom hook that extracts and manages common delegated stake logic
 * Handles data extraction, rejection, success, and error scenarios
 */
export const useDelegatedStake = (): UseDelegatedStakeReturn => {
  // Extract and decode request data
  const { message: requestMessage, data: decodedData } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<DelegatedStakeData>(location.href);
  }, []);

  // Common rejection handler
  const handleReject = useCallback(async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(new EIPRpcError('User rejected request', EIPErrorCodes.Rejected), requestMessage);
    window.close();
  }, [requestMessage]);

  // Common success handler
  const handleSuccess = useCallback(
    async (txHash: string) => {
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseResult(txHash, requestMessage);
      window.close();
    },
    [requestMessage]
  );

  // Common error handler
  const handleError = useCallback(
    async (error: unknown) => {
      console.error('Delegated stake error:', error);
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage]
  );

  return {
    requestMessage,
    decodedData,
    handleReject,
    handleSuccess,
    handleError,
  };
};
