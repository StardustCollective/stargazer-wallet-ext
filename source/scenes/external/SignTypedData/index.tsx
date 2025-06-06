import { ecsign, toRpcSig } from 'ethereumjs-util';
import * as ethers from 'ethers';
import React from 'react';

import type { MessagePayload } from 'scripts/Provider/evm';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';

import { usePlatformAlert } from 'utils/alertUtil';

import SignTypedDataContainer, { SignTypedDataProviderConfig } from './SignTypedDataContainer';

const SignTypedData = () => {
  const showAlert = usePlatformAlert();

  const signTypedData = (domain: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[0], types: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[1], value: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[2]): string => {
    const wallet = getWallet();
    const privateKeyHex = remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);

    const { v, r, s } = ecsign(Buffer.from(remove0x(msgHash), 'hex'), privateKey);
    const sig = preserve0x(toRpcSig(v, r, s));

    return sig;
  };

  const signTypedDataTransaction = async (parsedPayload: MessagePayload): Promise<string> => {
    const domainObject = parsedPayload.domain;
    const typesObject = parsedPayload.types;
    const messageObject = parsedPayload.message;

    const typesWithoutEIP712Domain = { ...typesObject };
    if ('EIP712Domain' in typesWithoutEIP712Domain) {
      delete typesWithoutEIP712Domain.EIP712Domain;
    }

    return signTypedData(domainObject, typesWithoutEIP712Domain, messageObject);
  };

  const defaultSignTypedDataConfig: SignTypedDataProviderConfig = {
    title: 'Sign Typed Data',
    footer: 'Only sign typed data on sites you trust.',
    onSign: async ({ parsedPayload }) => {
      try {
        return await signTypedDataTransaction(parsedPayload);
      } catch (error) {
        // Handle specific error cases
        if (error instanceof Error) {
          const errorMessage = error.message || 'There was an error signing the typed data.\nPlease try again later.';
          showAlert(errorMessage, 'danger');
        } else {
          showAlert('There was an error signing the typed data.\nPlease try again later.', 'danger');
        }

        throw error;
      }
    },
  };

  return <SignTypedDataContainer {...defaultSignTypedDataConfig} />;
};

export default SignTypedData;
