/* eslint-disable react/prop-types */
import React from 'react';

import { useAllowSpend, UseAllowSpendReturn } from 'hooks/external/useAllowSpend';

import AllowSpendView, { IAllowSpendProps } from 'scenes/external/views/allow-spend';

import { WalletParam } from 'scripts/Background/messaging';
import type { AllowSpendData } from 'scripts/Provider/constellation';

import { IAssetInfoState } from 'state/assets/types';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface AllowSpendProviderConfig {
  title: string;
  isLoading?: boolean;
  onAllowSpend: (data: { decodedData: AllowSpendData; asset: IAssetInfoState; fee: string; wallet: WalletParam }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
}

type AllowSpendContainerProps = AllowSpendData & UseAllowSpendReturn & BaseContainerProps;

/**
 * Container component that provides common allow spend functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const AllowSpendContainer: React.FC<AllowSpendProviderConfig> = ({ title, onAllowSpend, onError, onSuccess, isLoading = false }) => {
  // Extract onAction function
  const handleAllowSpendAction = async (hookData: UseAllowSpendReturn): Promise<string> => {
    const { decodedData, asset, fee, wallet } = hookData;
    return await onAllowSpend({ decodedData, asset, fee, wallet });
  };

  // Extract validation function
  const validateAllowSpendData = (decodedData: AllowSpendData): string | null => {
    if (!decodedData) return 'Invalid allow spend data';
    if (!decodedData.source) return 'Invalid source';
    if (!decodedData.destination) return 'Invalid destination';
    if (!decodedData.amount) return 'Invalid amount';
    if (!decodedData.approvers || !decodedData.approvers.length) return 'Invalid approvers';
    return null;
  };

  // Extract render function with proper typing
  const renderAllowSpendView = (props: AllowSpendContainerProps): JSX.Element => {
    const { title: propsTitle, asset, amount, destination, destinationInfo, spenderInfo, approvers, validUntilEpoch, latestEpoch, fee, setFee, isLoading: propsIsLoading, onAction, onReject, wallet } = props;

    const allowSpendProps: IAllowSpendProps = {
      title: propsTitle,
      wallet,
      asset,
      amount,
      destination,
      destinationInfo,
      spenderInfo,
      approvers,
      validUntilEpoch,
      latestEpoch,
      fee,
      setFee,
      isLoading: propsIsLoading,
      onSign: onAction,
      onReject,
    };
    return <AllowSpendView {...allowSpendProps} />;
  };

  return (
    <ExternalRequestContainer<AllowSpendData, string, UseAllowSpendReturn>
      title={title}
      isLoading={isLoading}
      useHook={useAllowSpend}
      onAction={handleAllowSpendAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateAllowSpendData}
    >
      {renderAllowSpendView}
    </ExternalRequestContainer>
  );
};

export default AllowSpendContainer;
