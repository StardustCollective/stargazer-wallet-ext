/* eslint-disable react/prop-types */
import React from 'react';

import { useTokenLock, UseTokenLockReturn } from 'hooks/external/useTokenLock';

import TokenLockView, { ITokenLockProps } from 'scenes/external/views/token-lock';

import { WalletParam } from 'scripts/Background/messaging';
import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import { IAssetInfoState } from 'state/assets/types';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface TokenLockProviderConfig {
  title: string;
  isLoading?: boolean;
  onTokenLock: (data: { decodedData: TokenLockDataParam; asset: IAssetInfoState; wallet: WalletParam }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
}

type TokenLockContainerProps = TokenLockDataParam & UseTokenLockReturn & BaseContainerProps;

/**
 * Container component that provides common token lock functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const TokenLockContainer: React.FC<TokenLockProviderConfig> = ({ title, onTokenLock, onError, onSuccess, isLoading = false }) => {
  // Extract onAction function
  const handleTokenLockAction = async (hookData: UseTokenLockReturn): Promise<string> => {
    const { decodedData, asset, wallet } = hookData;
    return await onTokenLock({ decodedData, asset, wallet });
  };

  // Extract validation function
  const validateTokenLockData = (decodedData: TokenLockDataParam): string | null => {
    if (!decodedData) return 'Invalid token lock data';
    if (!decodedData.source) return 'Invalid source';
    if (!decodedData.amount) return 'Invalid amount';
    return null;
  };

  // Extract render function with proper typing
  const renderTokenLockView = (props: TokenLockContainerProps): JSX.Element => {
    const { title: propsTitle, amount, unlockEpoch, latestEpoch, isLoading: propsIsLoading, asset, onAction, onReject, wallet } = props;

    const tokenLockProps: ITokenLockProps = {
      title: propsTitle,
      wallet,
      asset,
      amount,
      unlockEpoch,
      latestEpoch,
      isLoading: propsIsLoading,
      onSign: onAction,
      onReject,
    };
    return <TokenLockView {...tokenLockProps} />;
  };

  return (
    <ExternalRequestContainer<TokenLockDataParam, string, UseTokenLockReturn>
      title={title}
      isLoading={isLoading}
      useHook={useTokenLock}
      onAction={handleTokenLockAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateTokenLockData}
    >
      {renderTokenLockView}
    </ExternalRequestContainer>
  );
};

export default TokenLockContainer;
