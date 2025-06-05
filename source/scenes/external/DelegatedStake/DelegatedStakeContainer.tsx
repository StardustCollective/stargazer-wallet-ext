/* eslint-disable react/prop-types */
import type { DelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useDelegatedStake, UseDelegatedStakeReturn } from 'hooks/external/useDelegatedStake';

import DelegatedStakeView, { DelegatedStakeProps } from 'scenes/external/views/delegated-stake';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface DelegatedStakeProviderConfig {
  title: string;
  onDelegatedStake: (data: { decodedData: DelegatedStake }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
  isLoading?: boolean;
}

type DelegatedStakeContainerProps = DelegatedStake & UseDelegatedStakeReturn & BaseContainerProps;

/**
 * Container component that provides common delegated stake functionality
 */
const DelegatedStakeContainer: React.FC<DelegatedStakeProviderConfig> = ({ title, onDelegatedStake, onError, onSuccess, isLoading = false }) => {
  // Extract onAction function
  const handleDelegatedStakeAction = async (hookData: UseDelegatedStakeReturn): Promise<string> => {
    const { decodedData } = hookData;
    return await onDelegatedStake({ decodedData });
  };

  // Extract validation function - delegated stake has simple validation
  const validateDelegatedStakeData = (decodedData: DelegatedStake): string | null => {
    if (!decodedData) return 'Invalid delegated stake data';
    if (!decodedData.source) return 'Invalid source';
    if (!decodedData.nodeId) return 'Invalid node ID';
    if (!decodedData.amount) return 'Invalid amount';
    if (!decodedData.tokenLockRef) return 'Invalid token lock reference';
    return null;
  };

  // Extract render function with proper typing
  const renderDelegatedStakeView = (props: DelegatedStakeContainerProps): JSX.Element => {
    const { title: propsTitle, source, amount, nodeId, tokenLockRef, fee, onAction, onReject } = props;

    const delegatedStakeProps: DelegatedStakeProps = {
      title: propsTitle,
      source,
      amount,
      nodeId,
      tokenLockRef,
      fee,
      isLoading,
      onSign: onAction,
      onReject,
    };

    return <DelegatedStakeView {...delegatedStakeProps} />;
  };

  return (
    <ExternalRequestContainer<DelegatedStake, string, UseDelegatedStakeReturn>
      title={title}
      isLoading={isLoading}
      useHook={useDelegatedStake}
      onAction={handleDelegatedStakeAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateDelegatedStakeData}
    >
      {renderDelegatedStakeView}
    </ExternalRequestContainer>
  );
};

export default DelegatedStakeContainer;
