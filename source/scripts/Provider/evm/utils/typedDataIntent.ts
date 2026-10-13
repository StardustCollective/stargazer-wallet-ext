import { BigNumber, ethers } from 'ethers';

import type { MessagePayload } from 'scripts/Provider/evm';

export type TokenGrant = { token: string; amount: BigNumber; expiration?: BigNumber };

export type TypedDataIntent =
  | { kind: 'erc2612-permit'; primaryType: string; spender: string; grant: TokenGrant; deadline: BigNumber }
  | { kind: 'dai-permit'; primaryType: string; spender: string; token: string; allowed: boolean; expiry: BigNumber }
  | { kind: 'permit2-allowance'; primaryType: string; spender: string; grants: TokenGrant[]; sigDeadline: BigNumber }
  | { kind: 'permit2-transfer'; primaryType: string; spender: string; grants: TokenGrant[]; deadline: BigNumber }
  | {
      kind: 'erc3009-transfer';
      primaryType: string;
      token: string;
      from: string;
      to: string;
      value: BigNumber;
      validAfter: BigNumber;
      validBefore: BigNumber;
    }
  | { kind: 'marketplace-order'; primaryType: string }
  | { kind: 'delegated-transaction'; primaryType: string }
  | { kind: 'unknown-approval'; primaryType: string }
  | { kind: 'generic'; primaryType: string };

type TypeFields = Record<string, Array<{ name: string; type: string }>>;

// Deliberately broad: a false positive costs one extra warning, a false negative hides an approval.
const APPROVAL_LIKE = /permit|approv|allowance|authoriz/i;
const PERMIT2_TRANSFER_SINGLE = ['PermitTransferFrom', 'PermitWitnessTransferFrom'];
const PERMIT2_TRANSFER_BATCH = ['PermitBatchTransferFrom', 'PermitBatchWitnessTransferFrom'];
const ERC3009_TRANSFER = ['TransferWithAuthorization', 'ReceiveWithAuthorization'];
const MARKETPLACE_ORDER = ['OrderComponents', 'Order', 'BulkOrder'];
const DELEGATED_TRANSACTION = ['SafeTx', 'ForwardRequest', 'MetaTransaction'];
const PERMIT2_DETAILS = ['token', 'amount', 'expiration', 'nonce'];
const PERMIT2_PERMITTED = ['token', 'amount'];

const hasFields = (types: TypeFields, typeName: string, names: string[]) => {
  const fields = (types[typeName] ?? []).map(field => field.name);
  return names.every(name => fields.includes(name));
};

// True when `field` of `typeName` is a struct with `names` (or, with `isArray`, an array of such structs).
const hasStructField = (types: TypeFields, typeName: string, field: string, names: string[], isArray: boolean) => {
  const type = types[typeName]?.find(f => f.name === field)?.type;
  if (!type || type.endsWith('[]') !== isArray) return false;
  return hasFields(types, type.replace(/\[\]$/, ''), names);
};

// Parse exactly as ethers' typed-data encoder does, so the display matches the signed bytes.
const address = (value: unknown) => ethers.utils.getAddress(String(value));
const uint = (value: unknown) => BigNumber.from(value);
const list = (value: unknown): any[] => {
  if (!Array.isArray(value)) throw new Error('expected an array');
  return value;
};

const permit2Detail = (detail: any): TokenGrant => ({
  token: address(detail.token),
  amount: uint(detail.amount),
  expiration: uint(detail.expiration),
});
const permit2Permitted = (permitted: any): TokenGrant => ({
  token: address(permitted.token),
  amount: uint(permitted.amount),
});

// The intent of a recognised shape, or null when the primary type matches none. Throws when a matched shape fails to parse.
const matchShape = (
  primaryType: string,
  types: TypeFields,
  domain: { verifyingContract?: string },
  message: any
): TypedDataIntent | null => {
  if (primaryType === 'Permit' && hasFields(types, primaryType, ['owner', 'spender', 'value', 'nonce', 'deadline'])) {
    return {
      kind: 'erc2612-permit',
      primaryType,
      spender: address(message.spender),
      grant: { token: address(domain.verifyingContract), amount: uint(message.value) },
      deadline: uint(message.deadline),
    };
  }

  if (primaryType === 'Permit' && hasFields(types, primaryType, ['holder', 'spender', 'nonce', 'expiry', 'allowed'])) {
    // ethers encodes a bool as `!!value`, so a string "false" is signed as true.
    return {
      kind: 'dai-permit',
      primaryType,
      spender: address(message.spender),
      token: address(domain.verifyingContract),
      allowed: !!message.allowed,
      expiry: uint(message.expiry),
    };
  }

  if (
    primaryType === 'PermitSingle' &&
    hasFields(types, primaryType, ['spender', 'sigDeadline']) &&
    hasStructField(types, primaryType, 'details', PERMIT2_DETAILS, false)
  ) {
    return {
      kind: 'permit2-allowance',
      primaryType,
      spender: address(message.spender),
      grants: [permit2Detail(message.details)],
      sigDeadline: uint(message.sigDeadline),
    };
  }

  if (
    primaryType === 'PermitBatch' &&
    hasFields(types, primaryType, ['spender', 'sigDeadline']) &&
    hasStructField(types, primaryType, 'details', PERMIT2_DETAILS, true)
  ) {
    return {
      kind: 'permit2-allowance',
      primaryType,
      spender: address(message.spender),
      grants: list(message.details).map(permit2Detail),
      sigDeadline: uint(message.sigDeadline),
    };
  }

  const isPermit2TransferSingle =
    PERMIT2_TRANSFER_SINGLE.includes(primaryType) &&
    hasStructField(types, primaryType, 'permitted', PERMIT2_PERMITTED, false);
  const isPermit2TransferBatch =
    PERMIT2_TRANSFER_BATCH.includes(primaryType) &&
    hasStructField(types, primaryType, 'permitted', PERMIT2_PERMITTED, true);
  if (
    (isPermit2TransferSingle || isPermit2TransferBatch) &&
    hasFields(types, primaryType, ['spender', 'nonce', 'deadline'])
  ) {
    const grants = isPermit2TransferBatch
      ? list(message.permitted).map(permit2Permitted)
      : [permit2Permitted(message.permitted)];
    return {
      kind: 'permit2-transfer',
      primaryType,
      spender: address(message.spender),
      grants,
      deadline: uint(message.deadline),
    };
  }

  if (
    ERC3009_TRANSFER.includes(primaryType) &&
    hasFields(types, primaryType, ['from', 'to', 'value', 'validAfter', 'validBefore', 'nonce'])
  ) {
    return {
      kind: 'erc3009-transfer',
      primaryType,
      token: address(domain.verifyingContract),
      from: address(message.from),
      to: address(message.to),
      value: uint(message.value),
      validAfter: uint(message.validAfter),
      validBefore: uint(message.validBefore),
    };
  }

  if (MARKETPLACE_ORDER.includes(primaryType)) return { kind: 'marketplace-order', primaryType };
  if (DELEGATED_TRANSACTION.includes(primaryType)) return { kind: 'delegated-transaction', primaryType };

  // EIP-3009 cancel grants nothing; it is the one exception to the approval-like name rule below.
  if (primaryType === 'CancelAuthorization' && hasFields(types, primaryType, ['authorizer', 'nonce']))
    return { kind: 'generic', primaryType };

  return null;
};

/**
 * Classifies a typed-data payload by the primary type the signer hashes (inferred from `types`),
 * never by the dApp-declared `primaryType`. Never throws.
 */
export const classifyTypedData = (payload: MessagePayload): TypedDataIntent => {
  let primaryType = String(payload?.primaryType ?? 'Unknown');

  try {
    const types: TypeFields = { ...(payload.types as unknown as TypeFields) };
    delete types.EIP712Domain;
    primaryType = ethers.utils._TypedDataEncoder.from(types).primaryType;

    const intent = matchShape(primaryType, types, payload.domain ?? {}, payload.message ?? {});
    if (intent) return intent;

    return APPROVAL_LIKE.test(primaryType)
      ? { kind: 'unknown-approval', primaryType }
      : { kind: 'generic', primaryType };
  } catch {
    // A matched shape that fails to parse must still warn.
    return { kind: 'unknown-approval', primaryType };
  }
};
