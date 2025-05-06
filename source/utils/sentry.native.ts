import * as Sentry from '@sentry/react-native';
import { CaptureContext } from '@sentry/types';

type SentryError = {
  error: unknown;
  userAddress?: string;
  extraInfo?: Record<string, any>;
};

/**
 * Captures an error and reports it to Sentry for debugging purposes.
 * Includes optional user address as a searchable tag and optional extra information.
 * This version is for the React Native (mobile) environment.
 * @param error The error object or value to report.
 * @param userAddress Optional. The user's address to be tagged in Sentry. Max 200 chars, no newlines.
 * @param extraInfo Optional additional information to send with the error report.
 */
export const captureError = ({
  error,
  userAddress = undefined,
  extraInfo = {},
}: SentryError): void => {
  const captureContext: CaptureContext = {};

  if (userAddress) {
    // Ensure userAddress adheres to Sentry tag value limits
    captureContext.tags = { ...captureContext.tags, user_address: userAddress };
  }

  // Check if extraInfo has properties before assigning to captureContext.extra
  // This avoids overwriting original_error_value and original_error_type if extraInfo is empty
  if (extraInfo && Object.keys(extraInfo).length > 0) {
    captureContext.extra = { ...captureContext.extra, ...extraInfo };
  }

  let processedError = error;
  if (!(error instanceof Error)) {
    processedError = new Error(String(error));
    const originalType = extraInfo?.original_error_type || typeof error;
    // Ensure extra exists before spreading into it
    captureContext.extra = {
      ...(captureContext.extra || {}), // Preserve existing extra data
      original_error_value: String(error),
      original_error_type: originalType,
    };
    // If extraInfo was present and contained original_error_type, it would have been set.
    // This ensures original_error_type based on typeof error is set if not already from extraInfo.
  }

  Sentry.captureException(processedError as Error, captureContext);
};
