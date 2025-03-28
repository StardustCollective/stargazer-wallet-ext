import { BigNumber } from 'bignumber.js';

const FACTOR = 1e8;

/**
 * Converts a value from DAG to DATUM
 *
 * @param   value  Value in DAG
 * @returns Value in DATUM
 */
export const toDatum = (value: number | string): number => {
  return new BigNumber(value).multipliedBy(FACTOR).toNumber();
};

/**
 * Converts a value from DATUM to DAG
 *
 * @param   value  Value in DATUM
 * @returns Value in DAG
 */
export const toDag = (value: number | string): number => {
  return new BigNumber(value).dividedBy(FACTOR).toNumber();
};

/**
 * Formats a BigNumber value for UI display with locale formatting
 *
 * @param value Value to format
 * @param minimumFractionDigits Minimum number of decimal places (default 8)
 * @returns Formatted string with locale-specific formatting
 */
export const formatBigNumberForDisplay = (
  value: number | string,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 8
): string => {
  // First get the fixed representation
  const fixedValue = new BigNumber(value).toFixed();

  // Convert back to number for locale formatting
  const numberValue = Number(fixedValue);

  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

/**
 * Converts a value to a BigNumber
 *
 * @param   value  Value to convert
 * @returns Value as string
 */

export const convertBigNumber = (value: number | string): string => {
  return new BigNumber(value).toFixed();
};

export const fixedNumber = (num: number, digits: number): number => {
  return Number(num.toFixed(digits));
};

export const fixedStringNumber = (num: number, digits: number): string => {
  return num.toFixed(digits);
};

export const trimTrailingZeros = (num: number | string): string => {
  // Convert the input to a string if it's a number
  let numStr = typeof num === 'number' ? num.toString() : num;

  // Use a regular expression to remove trailing zeros
  // The regex looks for a decimal point followed by one or more digits, followed by zeros
  // It ensures that at least one digit remains after the decimal point
  numStr = numStr.replace(/(\.\d*?[1-9])0+$/, '$1');

  // If the number ends with a decimal point, remove it
  numStr = numStr.replace(/\.$/, '');

  return numStr;
};

export const countSignificantDigits = (num: number): number => {
  // If the number is greater than or equal to 1, return 2
  if (num >= 1) return 2;

  const numStr = num.toString();
  const decimalIndex = numStr.indexOf('.');
  if (decimalIndex === -1) return 0;

  // Count the number of leading zeros after the decimal point
  let count = 0;
  for (let i = decimalIndex + 1; i < numStr.length; i++) {
    if (numStr[i] !== '0') {
      // Return the count of zeros plus two for the first non-zero digit
      return count + 2;
    }
    count++;
  }

  // If all digits after the decimal are zeros, return 0
  return 0;
};

export const smallestPowerOfTen = (num: number): number => {
  // If not number or the number is greater than or equal to 1, return 0.1
  if (isNaN(num) || num >= 1) return 0.01;

  // Calculate the order of magnitude and subtract 1 to get the smallest power of ten
  const magnitude = Math.floor(Math.log10(num)) - 1;

  // Return the smallest power of ten less than or equal to the number
  return Math.pow(10, magnitude);
};
