import React from 'react';

//////////////////////
// Common Layouts
/////////////////////

import CardLayout from 'scenes/external/Layouts/CardLayout';

///////////////////////////
// Styles
///////////////////////////

import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { decodeFromBase64 } from 'utils/encoding';
import { dag4 } from '@stardust-collective/dag4';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import styles from './index.module.scss';
import { StargazerSignatureRequest } from 'scripts/Provider/constellation';

//////////////////////
// Component
/////////////////////

const SignatureRequest = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<{
      signatureRequestEncoded: string;
      asset: string;
      provider: string;
      chainLabel: string;
      walletLabel: string;
    }>(location.href);

  const { signatureRequestEncoded, asset, chainLabel, walletLabel } = data;

  const isDAGsignature = asset === 'DAG';

  const signatureRequest = JSON.parse(
    decodeFromBase64(signatureRequestEncoded)
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
    const message = isDAGsignature ? signatureRequestEncoded : signatureRequest.content;
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

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayout
      stepLabel=""
      originDescriptionLabel="Requested by:"
      headerLabel="Signature Request"
      footerLabel={
        'Signed messages do not incur gas fees.\nOnly sign messages on sites you trust.'
      }
      captionLabel=""
      negativeButtonLabel="Reject"
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel="Sign"
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <section>
          <label>Account</label>
          <div>{walletLabel}</div>
        </section>
        <section className={styles.message}>
          <label>Message</label>
          <div>{signatureRequest.content}</div>
        </section>
        <section className={styles.message}>
          <label>Network</label>
          <div>{chainLabel}</div>
        </section>
        {Object.keys(signatureRequest.metadata).length > 0 && (
          <section className={styles.metadata}>
            <label>Metadata</label>
            <div>
              {Object.entries(signatureRequest.metadata).map(([key, value]) => (
                <small>
                  {key} = {value}
                </small>
              ))}
            </div>
          </section>
        )}
      </div>
    </CardLayout>
  );
};

export default SignatureRequest;
