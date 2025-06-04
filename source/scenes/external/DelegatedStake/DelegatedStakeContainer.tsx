import React from 'react';

import { useDelegatedStake } from 'hooks/external/useDelegatedStake';

import DelegatedStakeView, { DelegatedStakeProps } from 'scenes/external/views/delegated-stake';

import type { DelegatedStakeData } from 'scripts/Provider/constellation';

import { usePlatformAlert } from 'utils/alertUtil';

export interface DelegatedStakeProviderConfig {
  title: string;
  onDelegatedStake: (data: { decodedData: DelegatedStakeData }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
  isLoading?: boolean;
}

/**
 * Container component that provides common delegated stake functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const DelegatedStakeContainer: React.FC<DelegatedStakeProviderConfig> = ({ title, onDelegatedStake, onError, onSuccess, isLoading = false }) => {
  const showAlert = usePlatformAlert();
  const { decodedData, handleReject, handleSuccess, handleError } = useDelegatedStake();

  // Validate required data
  if (!decodedData) {
    handleError(new Error('Invalid delegated stake data'));
    return null;
  }

  // Handle delegated stake action with service-specific logic
  const handleDelegatedStake = async () => {
    try {
      const txHash = await onDelegatedStake({
        decodedData,
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

  const props: DelegatedStakeProps = {
    title,
    wallet: decodedData.wallet,
    chain: decodedData.chain,
    source: decodedData.source,
    amount: decodedData.amount,
    nodeId: decodedData.nodeId,
    tokenLockRef: decodedData.tokenLockRef,
    fee: decodedData.fee,
    isPositiveButtonLoading: isLoading,
    onSign: handleDelegatedStake,
    onReject: handleReject,
  };

  return <DelegatedStakeView {...props} />;
};

export default DelegatedStakeContainer;
