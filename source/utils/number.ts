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
 * Converts a value to a BigNumber
 *
 * @param   value  Value to convert
 * @returns Value as string
 */

export const convertBigNumber = (value: number | string): string => {
  return new BigNumber(value).toFixed();
};
