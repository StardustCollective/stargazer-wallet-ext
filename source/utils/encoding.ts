/**
 * Encodes a string to base64
 * Uses native browser APIs or Node.js Buffer based on environment
 */
export const encodeToBase64 = (value: string): string => {
  // For browser environments
  if (typeof window !== 'undefined' && window.btoa) {
    // Handle Unicode characters properly in browsers
    return window.btoa(unescape(encodeURIComponent(value)));
  }
  // For Node.js environments
  return Buffer.from(value).toString('base64');
};

/**
 * Decodes a base64 string
 * Uses native browser APIs or Node.js Buffer based on environment
 */
export const decodeFromBase64 = (value: string): string => {
  // For browser environments
  if (typeof window !== 'undefined' && window.atob) {
    // Handle Unicode characters properly in browsers
    return decodeURIComponent(escape(window.atob(value)));
  }
  // For Node.js environments
  return Buffer.from(value, 'base64').toString();
};
