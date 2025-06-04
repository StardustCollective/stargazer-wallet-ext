import { useCallback, useMemo } from 'react';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import type { WithdrawDelegatedStakeData } from 'scripts/Provider/constellation';

export interface WithdrawDelegatedStakeHookData {
  requestMessage: StargazerRequestMessage;
  decodedData: WithdrawDelegatedStakeData;
}

export interface UseWithdrawDelegatedStakeReturn extends WithdrawDelegatedStakeHookData {
  handleReject: () => Promise<void>;
  handleSuccess: (txHash: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

/**
 * Custom hook that extracts and manages common withdraw delegated stake logic
 * Handles data extraction, rejection, success, and error scenarios
 */
export const useWithdrawDelegatedStake = (): UseWithdrawDelegatedStakeReturn => {
  // Extract and decode request data
  const { message: requestMessage, data: decodedData } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<WithdrawDelegatedStakeData>(location.href);
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
      console.error('Withdraw delegated stake error:', error);
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
