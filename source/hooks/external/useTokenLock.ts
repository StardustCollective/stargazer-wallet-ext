import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';

import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';

export interface TokenLockData {
  requestMessage: StargazerRequestMessage;
  decodedData: TokenLockDataParam;
  asset: IAssetInfoState;
}

export interface UseTokenLockReturn extends TokenLockData {
  handleReject: () => Promise<void>;
  handleSuccess: (txHash: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

/**
 * Custom hook that extracts and manages common token lock logic
 * Handles data extraction, rejection, success, and error scenarios
 */
export const useTokenLock = (): UseTokenLockReturn => {
  const { assets } = store.getState();
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  // Extract and decode request data
  const { message: requestMessage, data: decodedData } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<TokenLockDataParam>(location.href);
  }, []);

  // Get asset information
  const asset = useMemo(() => {
    if (!decodedData?.currencyId) return dagAsset;
    return Object.values(assets).find(a => a?.address === decodedData.currencyId) ?? null;
  }, [assets, decodedData?.currencyId, dagAsset]);

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
      console.error('Token lock error:', error);
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage]
  );

  return {
    requestMessage,
    decodedData,
    asset,
    handleReject,
    handleSuccess,
    handleError,
  };
};
