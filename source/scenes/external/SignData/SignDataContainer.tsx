/* eslint-disable react/prop-types */
import React from 'react';

import { useSignData, UseSignDataReturn } from 'hooks/external/useSignData';

import SignDataView, { ISignDataProps } from 'scenes/external/views/sign-data';

import type { ISignDataParams } from 'scripts/Provider/constellation';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface SignDataProviderConfig {
  title: string;
  footer?: string;
  onSign: (data: { payload: string }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (signature: string) => void;
}

type SignDataContainerProps = ISignDataParams & UseSignDataReturn & BaseContainerProps;

/**
 * Container component that provides common sign data functionality
 */
const SignDataContainer: React.FC<SignDataProviderConfig> = ({ title, footer = 'Only sign messages on sites you trust.', onSign, onError, onSuccess }) => {
  // Extract onAction function
  const handleSignDataAction = async (hookData: UseSignDataReturn): Promise<string> => {
    const { decodedData } = hookData;
    return await onSign({
      payload: decodedData.payload,
    });
  };

  // Extract validation function
  const validateSignDataData = (decodedData: ISignDataParams): string | null => {
    if (!decodedData?.payload) return 'Invalid payload';
    return null;
  };

  // Extract render function with proper typing
  const renderSignDataView = (props: SignDataContainerProps): JSX.Element => {
    const { title: propsTitle, footer: propsFooter, parsedPayload, decodedPayload, onAction, onReject } = props;

    const signDataProps: ISignDataProps = {
      title: propsTitle,
      transactionData: parsedPayload || decodedPayload,
      footer: propsFooter,
      onSign: onAction,
      onReject,
    };
    return <SignDataView {...signDataProps} />;
  };

  return (
    <ExternalRequestContainer<ISignDataParams, string, UseSignDataReturn> title={title} footer={footer} useHook={useSignData} onAction={handleSignDataAction} onError={onError} onSuccess={onSuccess} validateData={validateSignDataData}>
      {renderSignDataView}
    </ExternalRequestContainer>
  );
};

export default SignDataContainer;
