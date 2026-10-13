import { BigNumber, type BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { formatBigNumberForDisplay } from 'utils/number';

// Permit2 amounts are uint160; its max is the "unlimited" value Permit2 UIs use.
export const MAX_UINT160 = BigNumber.from(2).pow(160).sub(1);
export const UNLIMITED_THRESHOLD = BigNumber.from(2).pow(255);

// Permit2 expirations are uint48; its max means "never expires".
const MAX_UINT48 = BigNumber.from(2).pow(48).sub(1);
// The largest timestamp a JS Date can hold, in seconds.
const MAX_DATE_SECONDS = 8_640_000_000_000;

export const isUnlimitedAmount = (raw: BigNumber): boolean => raw.gte(UNLIMITED_THRESHOLD) || raw.eq(MAX_UINT160);

export const formatApprovalAmount = (
  raw: BigNumber,
  decimals?: number,
  symbol?: string
): { display: string; isUnlimited: boolean } => {
  if (isUnlimitedAmount(raw)) {
    return { display: 'UNLIMITED', isUnlimited: true };
  }

  if (decimals == null) {
    return { display: `${raw.toString()} (raw units)`, isUnlimited: false };
  }

  const amount = formatBigNumberForDisplay(formatUnits(raw, decimals));
  return { display: symbol ? `${amount} ${symbol}` : amount, isUnlimited: false };
};

// For EIP-2612 `deadline` and Permit2 `expiration`, 0 is already expired; DAI's `expiry` of 0 means never.
export const formatDeadline = (seconds: BigNumberish, opts: { zeroMeansNever?: boolean } = {}): string => {
  const value = BigNumber.from(seconds);

  if (value.gte(MAX_UINT48) || value.gt(MAX_DATE_SECONDS)) {
    return 'Never';
  }

  if (value.isZero() && opts.zeroMeansNever) {
    return 'Never';
  }

  const date = new Date(value.toNumber() * 1000);
  const label = date.toLocaleString();

  return date.getTime() <= Date.now() ? `${label} (expired)` : label;
};
