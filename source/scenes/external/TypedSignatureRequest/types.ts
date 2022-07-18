import { StargazerChain } from 'scripts/common';

export type TypedSignatureRequest = {
  chain: StargazerChain;
  signer: string;
  content: string;
  data?: Record<any, any>;
};
