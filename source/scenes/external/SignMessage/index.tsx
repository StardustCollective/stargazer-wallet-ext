import { dag4 } from '@stardust-collective/dag4';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import React from 'react';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';

import SignMessageContainer, { SignMessageProviderConfig } from './SignMessageContainer';

const SignMessage = () => {
  const signDagMessage = async (message: string, accountAddress: string): Promise<string> => {
    const { address } = dag4.account;

    if (address.toLowerCase() !== accountAddress.toLowerCase()) {
      throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
    }

    const privateKeyHex = dag4.account.keyTrio.privateKey;
    return await dag4.keyStore.personalSign(privateKeyHex, message);
  };

  const signEthMessage = async (message: string, accountAddress: string): Promise<string> => {
    const wallet = getWallet();

    if (wallet.address.toLowerCase() !== accountAddress.toLowerCase()) {
      throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
    }

    const privateKeyHex = remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(message));

    const { v, r, s } = ecsign(msgHash, privateKey);
    return preserve0x(toRpcSig(v, r, s));
  };

  const externalSigningConfig: SignMessageProviderConfig = {
    title: 'Sign Message',
    footer: 'Only sign messages on sites you trust.',
    onSign: async ({ payload, parsedPayload, wallet }) => {
      const isDag = wallet.chain === StargazerChain.CONSTELLATION;
      const message = isDag ? payload : parsedPayload.content;
      const signMessage = isDag ? signDagMessage : signEthMessage;

      return await signMessage(message, wallet.address);
    },
  };

  return <SignMessageContainer {...externalSigningConfig} />;
};

export default SignMessage;
