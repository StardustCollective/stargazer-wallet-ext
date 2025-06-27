import React, { ReactNode } from 'react';

import { usePlatformAlert } from 'utils/alertUtil';

/**
 * Base props that are common to all external request container components
 */
export interface BaseContainerProps {
  title: string;
  footer?: string;
  isLoading?: boolean;
  onAction: () => Promise<void>;
  onReject: () => Promise<void>;
}

/**
 * Base hook structure that all external request hooks extend
 */
export interface BaseExternalRequestHook<TData> {
  decodedData: TData;
  handleReject: () => Promise<void>;
  handleSuccess: (result: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

export interface ExternalRequestConfig<TData, TResult extends string, THook extends BaseExternalRequestHook<TData>> {
  title: string;
  footer?: string;
  isLoading?: boolean;
  useHook: () => THook;
  onAction: (hookData: THook) => Promise<TResult>;
  onError?: (error: unknown) => void;
  onSuccess?: (result: TResult) => void;
  validateData?: (decodedData: TData, hookData?: THook) => string | null; // Return error message or null if valid
  children: (props: TData & THook & BaseContainerProps) => ReactNode;
}

/**
 * Generic container component that provides common external request functionality
 * Allows each service to inject their own logic while reusing common patterns
 */
export const ExternalRequestContainer = <TData, TResult extends string, THook extends BaseExternalRequestHook<TData>>({
  title,
  footer,
  isLoading = false,
  useHook,
  onAction,
  onError,
  onSuccess,
  validateData,
  children,
}: ExternalRequestConfig<TData, TResult, THook>): JSX.Element | null => {
  const showAlert = usePlatformAlert();
  const hookData = useHook();
  const { decodedData, handleReject, handleSuccess, handleError } = hookData;

  // Validate required data
  if (validateData) {
    const validationError = validateData(decodedData, hookData);
    if (validationError) {
      handleError(new Error(validationError));
      return null;
    }
  }

  if (!decodedData) {
    handleError(new Error('Invalid request data'));
    return null;
  }

  // Handle action with service-specific logic
  const handleAction = async (): Promise<void> => {
    try {
      const result = await onAction(hookData);

      if (onSuccess) {
        onSuccess(result);
      } else {
        handleSuccess(result);
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

  const props: TData & THook & BaseContainerProps = {
    title,
    footer,
    isLoading,
    ...decodedData,
    ...hookData,
    onAction: handleAction,
    onReject: handleReject,
  };

  return <>{children(props)}</>;
};
