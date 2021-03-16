import { IAssetState } from 'state/wallet/types';
import BigNumber from 'bignumber.js';

/**
 * Shortcut to create a BigNumber
 *
 * @param {string | number | BigNumber.Instance} value
 * @returns {BigNumber} The BigNumber interface from the given value.
 */
const bn = (value: BigNumber.Value) => new BigNumber(value);

export interface IAccountInfo {
  assets: {
    [assetId: string]: IAssetState;
  };
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number | undefined;
}

export type ETHNetwork = 'testnet' | 'mainnet';

const ASSET_DECIMAL = 8;

export enum Denomination {
  /**
   * values for asset amounts in base units (no decimal)
   */
  BASE = 'BASE',
  /**
   * values of asset amounts (w/ decimal)
   */
  ASSET = 'ASSET',
}

type Amount<T> = {
  type: T;
  amount: () => BigNumber;
  decimal: number;
};

export type BaseAmount = Amount<Denomination.BASE>;
export type AssetAmount = Amount<Denomination.ASSET>;

export const baseAmount = (
  value: string | number | BigNumber | undefined,
  decimal: number = ASSET_DECIMAL
) =>
  ({
    type: Denomination.BASE,
    amount: () => fixedBN(value, 0),
    decimal,
  } as BaseAmount);

/**
 * Helper to check whether a BigNumber is valid or not
 *
 * @param {BigNumber} value
 * @returns {boolean} `true` or `false`.
 * */
export const isValidBN = (value: BigNumber) => !value.isNaN();

/**
 * Helper to get a fixed `BigNumber`
 * Returns zero `BigNumber` if `value` is invalid
 *
 * @param {number|string|BigNumber|undefined} value
 * @param {number} decimalPlaces The decimal place. (optional)
 * @returns {BigNumber} The BigNumber interface from the given value and decimal.
 * */
export const fixedBN = (
  value: number | string | BigNumber | undefined,
  decimalPlaces = 2
): BigNumber => {
  const n = bn(value || 0);
  const fixedBN = isValidBN(n)
    ? n.toFixed(decimalPlaces)
    : bn(0).toFixed(decimalPlaces);
  return bn(fixedBN);
};
