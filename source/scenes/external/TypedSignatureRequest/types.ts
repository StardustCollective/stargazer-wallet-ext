import { StargazerChain } from 'scripts/common';

export type TypedSignatureRequest = {
  chain: StargazerChain;
  signer: string;
  content: string;
  data?: Record<any, any>;
};

export type EIP712Domain = {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
  salt?: string;
};
