/* eslint-disable react/prop-types */
import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useWithdrawDelegatedStake, UseWithdrawDelegatedStakeReturn } from 'hooks/external/useWithdrawDelegatedStake';

import WithdrawDelegatedStakeView, { WithdrawDelegatedStakeProps } from 'scenes/external/views/withdraw-delegated-stake';

import { WalletParam } from 'scripts/Background/messaging';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface WithdrawDelegatedStakeProviderConfig {
  title: string;
  onWithdrawDelegatedStake: (data: { decodedData: WithdrawDelegatedStake; wallet: WalletParam }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
  isLoading?: boolean;
}

type WithdrawDelegatedStakeContainerProps = WithdrawDelegatedStake & UseWithdrawDelegatedStakeReturn & BaseContainerProps;

/**
 * Container component that provides common withdraw delegated stake functionality
 */
const WithdrawDelegatedStakeContainer: React.FC<WithdrawDelegatedStakeProviderConfig> = ({ title, onWithdrawDelegatedStake, onError, onSuccess, isLoading = false }) => {
  // Extract onAction function
  const handleWithdrawDelegatedStakeAction = async (hookData: UseWithdrawDelegatedStakeReturn): Promise<string> => {
    const { decodedData, wallet } = hookData;
    return await onWithdrawDelegatedStake({ decodedData, wallet });
  };

  // Extract validation function - withdraw delegated stake has simple validation
  const validateWithdrawDelegatedStakeData = (decodedData: WithdrawDelegatedStake): string | null => {
    if (!decodedData) return 'Invalid withdraw delegated stake data';
    if (!decodedData.source) return 'Invalid source';
    if (!decodedData.stakeRef) return 'Invalid stake reference';
    return null;
  };

  // Extract render function with proper typing
  const renderWithdrawDelegatedStakeView = (props: WithdrawDelegatedStakeContainerProps): JSX.Element => {
    const { title: propsTitle, source, stakeRef, onAction, onReject, wallet } = props;

    const withdrawDelegatedStakeProps: WithdrawDelegatedStakeProps = {
      title: propsTitle,
      wallet,
      source,
      stakeRef,
      isLoading,
      onSign: onAction,
      onReject,
    };

    return <WithdrawDelegatedStakeView {...withdrawDelegatedStakeProps} />;
  };

  return (
    <ExternalRequestContainer<WithdrawDelegatedStake, string, UseWithdrawDelegatedStakeReturn>
      title={title}
      isLoading={isLoading}
      useHook={useWithdrawDelegatedStake}
      onAction={handleWithdrawDelegatedStakeAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateWithdrawDelegatedStakeData}
    >
      {renderWithdrawDelegatedStakeView}
    </ExternalRequestContainer>
  );
};

export default WithdrawDelegatedStakeContainer;
