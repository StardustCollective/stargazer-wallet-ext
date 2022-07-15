import { StargazerChain } from 'scripts/common';

export type SignatureConsent = {
  chain: StargazerChain;
  signer: string;
  content: string;
  data?: Record<any, any>;
};
