/**
 * Retry function for API calls with configurable attempts and timeout
 * @param call - The function to execute (should return a Promise)
 * @param attempts - Number of attempts to make. Default is 2.
 * @param timeout - Timeout in milliseconds between attempts. Default is 1000.
 * @returns Promise that resolves with the successful result or rejects with the last error
 */
export const retry = async <T>(
  call: () => Promise<T>,
  attempts: number = 2,
  timeout: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await call();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If this was the last attempt, don't wait
      if (attempt === attempts) {
        break;
      }
      
      // Wait for the specified timeout before the next attempt
      await sleep(timeout);
    }
  }
  
  // All attempts failed, throw the last error
  throw lastError;
};

/**
 * Sleep utility function for delays
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
