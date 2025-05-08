/**
 * Retries a given asynchronous function a specified number of times with a delay,
 * and a timeout for each individual attempt.
 *
 * @template T The expected type of the result from the request function.
 * @param {() => Promise<T>} requestFn The asynchronous function to be executed.
 *                                     This function should return a Promise.
 * @param {(result: T) => void} onSuccess The callback function to be invoked upon successful completion.
 *                                        It receives the result of the request.
 * @param {object} [options] Optional configuration for retry behavior.
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked if all attempts fail
 *                                         or if an initial parameter validation fails. If not provided,
 *                                         errors will be thrown.
 * @param {number} [options.attemptTimeoutMs=2000] The time in milliseconds to wait between retry attempts.
 * @param {number} [options.attempts=5] The total number of attempts to try the request. Must be at least 1.
 * @param {number} [options.requestTimeoutMs] The maximum time in milliseconds a single request attempt can take
 *                                  before it's considered timed out and rejected. If not provided,
 *                                  or not positive, no timeout is applied to individual requests.
 * @returns {Promise<void>} A promise that resolves when the retry mechanism is complete
 *                          (i.e., one of the callbacks has been or is about to be invoked),
 *                          or rejects if an error occurs and no `onError` callback is provided.
 */
export async function retry<T>(
  requestFn: () => Promise<T>,
  onSuccess: (result: T) => void,
  options?: {
    onError?: (error: Error) => void;
    attemptTimeoutMs?: number;
    attempts?: number;
    requestTimeoutMs?: number;
  }
): Promise<void> {
  const {
    onError,
    attemptTimeoutMs = 200,
    attempts = 3,
    requestTimeoutMs,
  } = options || {};

  if (attempts < 1) {
    const err = new Error('Number of attempts must be at least 1.');
    if (onError) {
      // Ensure callback is called asynchronously
      await Promise.resolve().then(() => onError(err));
      return;
    } else {
      throw err;
    }
  }

  if (requestTimeoutMs !== undefined && requestTimeoutMs <= 0) {
    const err = new Error('Request timeout must be greater than 0 if provided.');
    if (onError) {
      await Promise.resolve().then(() => onError(err));
      return;
    } else {
      throw err;
    }
  }

  for (let i = 0; i < attempts; i++) {
    try {
      let result: T;
      const currentRequestPromise = requestFn();

      if (requestTimeoutMs !== undefined && requestTimeoutMs > 0) {
        const timeoutPromise = new Promise<T>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Request attempt ${i + 1} timed out after ${requestTimeoutMs}ms`
                )
              ),
            requestTimeoutMs
          )
        );
        result = await Promise.race([currentRequestPromise, timeoutPromise]);
      } else {
        result = await currentRequestPromise;
      }

      await Promise.resolve().then(() => onSuccess(result)); // Success
      return;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      if (i === attempts - 1) {
        // Final attempt failed
        if (onError) {
          await Promise.resolve().then(() => onError(error));
          return;
        } else {
          throw error;
        }
      }

      // Wait for the specified timeout before the next attempt, if timeout is positive
      if (attemptTimeoutMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, attemptTimeoutMs));
      }
    }
  }
}
