import React from 'react';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { decodeFromBase64 } from 'utils/encoding';
import { dag4 } from '@stardust-collective/dag4';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import type {
  ISignMessageParams,
  StargazerSignatureRequest,
} from 'scripts/Provider/constellation';
import SignMessageView, { ISignMessageProps } from '../views/sign-message';

const SignatureRequest = () => {
  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<ISignMessageParams>(
      location.href
    );

  const { payload, asset, chain, wallet } = data;

  const isDAGsignature = asset === 'DAG';

  const payloadDecoded = JSON.parse(
    decodeFromBase64(payload)
  ) as StargazerSignatureRequest;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      requestMessage
    );
    window.close();
  };

  const signDagMessage = async (message: string): Promise<string> => {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const signature = await dag4.keyStore.personalSign(privateKeyHex, message);
    return signature;
  };

  const signEthMessage = async (message: string): Promise<string> => {
    const wallet = getWallet();
    const privateKeyHex = remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(message));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = preserve0x(toRpcSig(v, r, s));

    return sig;
  };

  const onPositiveButtonClick = async () => {
    const message = isDAGsignature ? payload : payloadDecoded.content;
    const signMessage = isDAGsignature ? signDagMessage : signEthMessage;

    try {
      const signature = await signMessage(message);
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(signature, requestMessage);
    } catch (err) {
      console.log(err);
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(err, requestMessage);
    }

    window.close();
  };

  const props: ISignMessageProps = {
    title: 'Signature Request',
    account: wallet,
    network: chain,
    message: payloadDecoded,
    footer: 'Only sign messages on sites you trust.',
    onSign: onPositiveButtonClick,
    onReject: onNegativeButtonClick,
  };

  return <SignMessageView {...props} />;
};

export default SignatureRequest;
