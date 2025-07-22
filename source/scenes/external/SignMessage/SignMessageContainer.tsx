/* eslint-disable react/prop-types */
import React from 'react';

import { useSignMessage, UseSignMessageReturn } from 'hooks/external/useSignMessage';

import SignMessageView, { ISignMessageProps } from 'scenes/external/views/sign-message';

import { WalletParam } from 'scripts/Background/messaging';
import type { ISignMessageParams } from 'scripts/Provider/constellation';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface SignMessageProviderConfig {
  title: string;
  footer?: string;
  onSign: (data: { payload: string; parsedPayload: any; wallet: WalletParam }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (signature: string) => void;
}

type SignMessageContainerProps = ISignMessageParams & UseSignMessageReturn & BaseContainerProps;

/**
 * Container component that provides common sign message functionality
 */
const SignMessageContainer: React.FC<SignMessageProviderConfig> = ({ title, footer = 'Only sign messages on sites you trust.', onSign, onError, onSuccess }) => {
  // Extract onAction function
  const handleSignMessageAction = async (hookData: UseSignMessageReturn): Promise<string> => {
    const { parsedPayload, decodedData, wallet } = hookData;
    return await onSign({
      payload: decodedData.payload,
      parsedPayload,
      wallet,
    });
  };

  // Extract validation function - matches original logic
  const validateSignMessageData = (decodedData: ISignMessageParams, hookData?: UseSignMessageReturn): string | null => {
    if (!decodedData?.payload) return 'Invalid payload';

    if (hookData) {
      const { parsedPayload } = hookData;
      if (!parsedPayload?.content) {
        return 'Invalid payload content';
      }
    }

    return null;
  };

  // Extract render function with proper typing
  const renderSignMessageView = (props: SignMessageContainerProps): JSX.Element => {
    const { title: propsTitle, footer: propsFooter, wallet, parsedPayload, onAction, onReject } = props;

    const signMessageProps: ISignMessageProps = {
      title: propsTitle,
      wallet,
      message: parsedPayload,
      footer: propsFooter,
      onSign: onAction,
      onReject,
    };
    return <SignMessageView {...signMessageProps} />;
  };

  return (
    <ExternalRequestContainer<ISignMessageParams, string, UseSignMessageReturn>
      title={title}
      footer={footer}
      useHook={useSignMessage}
      onAction={handleSignMessageAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateSignMessageData}
    >
      {renderSignMessageView}
    </ExternalRequestContainer>
  );
};

export default SignMessageContainer;
