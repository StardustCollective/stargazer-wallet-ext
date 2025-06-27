import { useCallback, useMemo } from 'react';

import { StargazerExternalPopups, StargazerWSMessageBroker, WalletParam } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';

export interface ExternalRequestData<T = any> {
  requestMessage: StargazerRequestMessage;
  decodedData: T;
  origin: string;
  route: string;
  wallet?: WalletParam;
  resolved: boolean;
}

export interface ExternalRequestHandlers {
  handleReject: () => Promise<void>;
  handleSuccess: (result: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

export interface UseExternalRequestReturn<T> extends ExternalRequestData<T>, ExternalRequestHandlers {}

/**
 * Generic hook for external requests that provides common functionality
 * @param operationName - Used for error logging (optional)
 */
export const useExternalRequest = <T = any>(operationName?: string): UseExternalRequestReturn<T> => {
  // Extract and decode request data
  const {
    message: requestMessage,
    data: decodedData,
    origin,
    wallet,
    route,
    resolved,
  } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<T>(location.href);
  }, []);

  // Common rejection handler
  const handleReject = useCallback(async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(new EIPRpcError('User rejected request', EIPErrorCodes.Rejected), requestMessage);
    window.close();
  }, [requestMessage]);

  // Common success handler
  const handleSuccess = useCallback(
    async (result: string) => {
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseResult(result, requestMessage);
      window.close();
    },
    [requestMessage]
  );

  // Common error handler
  const handleError = useCallback(
    async (error: unknown) => {
      const errorMessage = operationName ? `${operationName} error:` : 'Operation error:';
      console.error(errorMessage, error);
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage, operationName]
  );

  return {
    requestMessage,
    decodedData,
    origin,
    route,
    wallet,
    resolved,
    handleReject,
    handleSuccess,
    handleError,
  };
};
