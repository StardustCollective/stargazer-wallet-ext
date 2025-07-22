import { dag4 } from '@stardust-collective/dag4';
import React from 'react';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';

import SignDataContainer, { SignDataProviderConfig } from './SignDataContainer';

const SignData = () => {
  const signData = async (value: string): Promise<string> => {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const signature = await dag4.keyStore.dataSign(privateKeyHex, value);
    return signature;
  };

  const stargazerSigningConfig: SignDataProviderConfig = {
    title: 'Sign Data Transaction',
    footer: 'Only sign data transactions from sites you trust.',
    onSign: async ({ payload, wallet }) => {
      const isDag = wallet.chain === StargazerChain.CONSTELLATION;
      const addressMatch = dag4.account.keyTrio.address.toLowerCase() === wallet.address.toLowerCase();

      if (!isDag) {
        throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
      }

      if (!addressMatch) {
        throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
      }

      return await signData(payload);
    },
  };

  return <SignDataContainer {...stargazerSigningConfig} />;
};

export default SignData;
