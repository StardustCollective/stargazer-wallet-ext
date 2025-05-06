import { scope } from '../web/sentry/initialize'; // Import the initialized scope

type SentryError = {
  error: unknown;
  userAddress?: string;
  extraInfo?: Record<string, any>;
};

/**
 * Captures an error and reports it to Sentry for debugging purposes.
 * Includes optional user address as a searchable tag and optional extra information.
 * This version is for the web (browser extension) environment.
 * @param error The error object or value to report.
 * @param userAddress Optional. The user's address to be tagged in Sentry. Max 200 chars, no newlines.
 * @param extraInfo Optional additional information to send with the error report.
 */
export const captureError = ({
  error,
  userAddress = undefined,
  extraInfo = {},
}: SentryError): void => {
  if (userAddress) {
    // Ensure userAddress adheres to Sentry tag value limits
    scope.setTag('user_address', userAddress);
  }

  let processedError = error;
  let originalErrorContext = {};
  if (!(error instanceof Error)) {
    processedError = new Error(String(error));
    originalErrorContext = {
      original_error_value: String(error),
      original_error_type: extraInfo?.original_error_type || typeof error,
    };
  }

  // Combine extraInfo from params with original error context
  scope.setContext('extra_debug_info', {
    ...extraInfo,
    ...originalErrorContext,
  });

  scope.captureException(processedError as Error);
};
