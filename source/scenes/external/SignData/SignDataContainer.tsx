import React from 'react';

import { useSignData } from 'hooks/external/useSignData';

import SignDataView, { ISignDataProps } from 'scenes/external/views/sign-data';

import { usePlatformAlert } from 'utils/alertUtil';

export interface SignDataProviderConfig {
  title: string;
  footer?: string;
  onSign: (data: { payload: string; parsedPayload: any; decodedPayload: string; decodedData: any }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (signature: string) => void;
}

/**
 * Container component that provides common sign data functionality
 * Allows each service to inject their own signing logic while reusing UI and common patterns
 */
const SignDataContainer: React.FC<SignDataProviderConfig> = ({ title, footer = 'Only sign messages on sites you trust.', onSign, onError, onSuccess }) => {
  const showAlert = usePlatformAlert();
  const { decodedData, parsedPayload, decodedPayload, handleReject, handleSuccess, handleError } = useSignData();

  // Validate required data
  if (!decodedData?.payload) {
    handleError(new Error('Invalid payload'));
    return null;
  }

  // Handle sign action with service-specific logic
  const handleSign = async () => {
    try {
      const signature = await onSign({
        payload: decodedData.payload,
        parsedPayload,
        decodedPayload,
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

  const props: ISignDataProps = {
    title,
    account: decodedData.wallet,
    network: decodedData.chain,
    transactionData: parsedPayload || decodedPayload,
    footer,
    onSign: handleSign,
    onReject: handleReject,
  };

  return <SignDataView {...props} />;
};

export default SignDataContainer;
