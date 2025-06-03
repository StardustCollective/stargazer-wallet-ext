import React from 'react';

import { useSignMessage } from 'hooks/external/useSignMessage';

import SignMessageView, { ISignMessageProps } from 'scenes/external/views/sign-message';

import { usePlatformAlert } from 'utils/alertUtil';

export interface SignMessageProviderConfig {
  title: string;
  footer?: string;
  onSign: (data: { payload: string; parsedPayload: any; isDagSignature: boolean; decodedData: any }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (signature: string) => void;
}

/**
 * Container component that provides common sign message functionality
 * Allows each service to inject their own signing logic while reusing UI and common patterns
 */
const SignMessageContainer: React.FC<SignMessageProviderConfig> = ({ title, footer = 'Only sign messages on sites you trust.', onSign, onError, onSuccess }) => {
  const showAlert = usePlatformAlert();
  const { decodedData, parsedPayload, isDagSignature, handleReject, handleSuccess, handleError } = useSignMessage();

  // Validate required data
  if (!parsedPayload?.content && !isDagSignature) {
    handleError(new Error('Invalid payload'));
    return null;
  }

  // Handle sign action with service-specific logic
  const handleSign = async () => {
    try {
      const signature = await onSign({
        payload: decodedData.payload,
        parsedPayload,
        isDagSignature,
        decodedData,
      });

      if (onSuccess) {
        onSuccess(signature);
      } else {
        handleSuccess(signature);
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

  const props: ISignMessageProps = {
    title,
    account: decodedData.wallet,
    network: decodedData.chain,
    deviceId: decodedData.deviceId,
    message: parsedPayload,
    footer,
    onSign: handleSign,
    onReject: handleReject,
  };

  return <SignMessageView {...props} />;
};

export default SignMessageContainer;
