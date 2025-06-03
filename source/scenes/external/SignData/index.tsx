import { dag4 } from '@stardust-collective/dag4';
import React from 'react';

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
    onSign: async ({ payload }) => {
      return await signData(payload);
    },
  };

  return <SignDataContainer {...stargazerSigningConfig} />;
};

export default SignData;
