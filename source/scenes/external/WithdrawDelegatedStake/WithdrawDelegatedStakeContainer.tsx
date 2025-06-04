import React from 'react';

import { useWithdrawDelegatedStake } from 'hooks/external/useWithdrawDelegatedStake';

import WithdrawDelegatedStakeView, { WithdrawDelegatedStakeProps } from 'scenes/external/views/withdraw-delegated-stake';

import type { WithdrawDelegatedStakeData } from 'scripts/Provider/constellation';

import { usePlatformAlert } from 'utils/alertUtil';

export interface WithdrawDelegatedStakeProviderConfig {
  title: string;
  onWithdrawDelegatedStake: (data: { decodedData: WithdrawDelegatedStakeData }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
  isLoading?: boolean;
}

/**
 * Container component that provides common withdraw delegated stake functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const WithdrawDelegatedStakeContainer: React.FC<WithdrawDelegatedStakeProviderConfig> = ({ title, onWithdrawDelegatedStake, onError, onSuccess, isLoading = false }) => {
  const showAlert = usePlatformAlert();
  const { decodedData, handleReject, handleSuccess, handleError } = useWithdrawDelegatedStake();

  // Validate required data
  if (!decodedData) {
    handleError(new Error('Invalid withdraw delegated stake data'));
    return null;
  }

  // Handle withdraw delegated stake action with service-specific logic
  const handleWithdrawDelegatedStake = async () => {
    try {
      const txHash = await onWithdrawDelegatedStake({
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

  const props: WithdrawDelegatedStakeProps = {
    title,
    wallet: decodedData.wallet,
    chain: decodedData.chain,
    source: decodedData.source,
    stakeRef: decodedData.stakeRef,
    isPositiveButtonLoading: isLoading,
    onSign: handleWithdrawDelegatedStake,
    onReject: handleReject,
  };

  return <WithdrawDelegatedStakeView {...props} />;
};

export default WithdrawDelegatedStakeContainer;
