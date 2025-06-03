import React from 'react';

import { useTokenLock } from 'hooks/external/useTokenLock';

import TokenLockView, { ITokenLockProps } from 'scenes/external/views/token-lock';

import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';

export interface TokenLockProviderConfig {
  title: string;
  onTokenLock: (data: { decodedData: TokenLockDataParam; asset: IAssetInfoState }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
  isLoading?: boolean;
}

/**
 * Container component that provides common token lock functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const TokenLockContainer: React.FC<TokenLockProviderConfig> = ({ title, onTokenLock, onError, onSuccess, isLoading = false }) => {
  const showAlert = usePlatformAlert();
  const { decodedData, asset, handleReject, handleSuccess, handleError } = useTokenLock();

  // Validate required data
  if (!asset) {
    handleError(new Error('Asset not found'));
    return null;
  }

  if (!decodedData) {
    handleError(new Error('Invalid token lock data'));
    return null;
  }

  // Handle token lock action with service-specific logic
  const handleTokenLock = async () => {
    try {
      const txHash = await onTokenLock({
        decodedData,
        asset,
      });

      if (onSuccess) {
        onSuccess(txHash);
      } else {
        handleSuccess(txHash);
      }
    } catch (error: unknown) {
      if (onError) {
        onError(error);
      } else {
        handleError(error);
        showAlert(error instanceof Error ? error.message : 'Unknown error occurred', 'danger');
      }
    }
  };

  // Wrap handleReject to match expected async signature
  const handleRejectAsync = async () => {
    handleReject();
  };

  const props: ITokenLockProps = {
    title,
    wallet: decodedData.wallet,
    chain: decodedData.chain,
    currencyId: decodedData.currencyId,
    amount: decodedData.amount,
    unlockEpoch: decodedData.unlockEpoch,
    fee: decodedData.fee,
    latestEpoch: decodedData.latestEpoch,
    isPositiveButtonLoading: isLoading,
    onSign: handleTokenLock,
    onReject: handleRejectAsync,
  };

  return <TokenLockView {...props} />;
};

export default TokenLockContainer;
