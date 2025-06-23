/* eslint-disable react/prop-types */
import React from 'react';

import { useSignTypedData, UseSignTypedDataReturn } from 'hooks/external/useSignTypedData';

import SignTypedDataView, { ISignTypedDataProps } from 'scenes/external/views/sign-typed-data';

import { WalletParam } from 'scripts/Background/messaging';
import type { MessagePayload, SignTypedDataParams } from 'scripts/Provider/evm';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface SignTypedDataProviderConfig {
  title: string;
  footer?: string;
  onSign: (data: { parsedPayload: MessagePayload; wallet: WalletParam }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (signature: string) => void;
}

type SignTypedDataContainerProps = SignTypedDataParams & UseSignTypedDataReturn & BaseContainerProps;

/**
 * Container component that provides common sign typed data functionality
 */
const SignTypedDataContainer: React.FC<SignTypedDataProviderConfig> = ({ title, footer = 'Only sign messages on sites you trust.', onSign, onError, onSuccess }) => {
  // Extract onAction function
  const handleSignTypedDataAction = async (hookData: UseSignTypedDataReturn): Promise<string> => {
    const { parsedPayload, wallet } = hookData;
    return await onSign({
      parsedPayload,
      wallet,
    });
  };

  // Extract validation function - matches original logic
  const validateSignTypedDataData = (decodedData: SignTypedDataParams, hookData?: UseSignTypedDataReturn): string | null => {
    if (!decodedData?.payload) return 'Invalid payload';

    if (hookData) {
      const { parsedPayload } = hookData;
      if (!parsedPayload?.domain || !parsedPayload?.types || !parsedPayload?.message) {
        return 'Invalid typed data payload structure';
      }
    }

    return null;
  };

  // Extract render function with proper typing
  const renderSignTypedDataView = (props: SignTypedDataContainerProps): JSX.Element => {
    const { title: propsTitle, footer: propsFooter, parsedPayload, onAction, onReject, wallet } = props;

    const signTypedDataProps: ISignTypedDataProps = {
      title: propsTitle,
      wallet,
      typedData: parsedPayload,
      footer: propsFooter,
      onSign: onAction,
      onReject,
    };
    return <SignTypedDataView {...signTypedDataProps} />;
  };

  return (
    <ExternalRequestContainer<SignTypedDataParams, string, UseSignTypedDataReturn>
      title={title}
      footer={footer}
      useHook={useSignTypedData}
      onAction={handleSignTypedDataAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateSignTypedDataData}
    >
      {renderSignTypedDataView}
    </ExternalRequestContainer>
  );
};

export default SignTypedDataContainer;
