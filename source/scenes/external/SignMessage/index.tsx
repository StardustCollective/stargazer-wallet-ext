import { dag4 } from '@stardust-collective/dag4';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import React from 'react';

import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';

import SignMessageContainer, { SignMessageProviderConfig } from './SignMessageContainer';

const SignMessage = () => {
  const signDagMessage = async (message: string): Promise<string> => {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    return await dag4.keyStore.personalSign(privateKeyHex, message);
  };

  const signEthMessage = async (message: string): Promise<string> => {
    const wallet = getWallet();
    const privateKeyHex = remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(message));

    const { v, r, s } = ecsign(msgHash, privateKey);
    return preserve0x(toRpcSig(v, r, s));
  };

  const externalSigningConfig: SignMessageProviderConfig = {
    title: 'Sign Message',
    footer: 'Only sign messages on sites you trust.',
    onSign: async ({ payload, parsedPayload, isDagSignature }) => {
      const message = isDagSignature ? payload : parsedPayload.content;
      const signMessage = isDagSignature ? signDagMessage : signEthMessage;

      return await signMessage(message);
    },
  };

  return <SignMessageContainer {...externalSigningConfig} />;
};

export default SignMessage;
