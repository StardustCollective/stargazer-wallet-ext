import React from 'react';
import queryString from 'query-string';
import { dag4 } from '@stardust-collective/dag4';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import CardLayout from 'scenes/external/Layouts/CardLayout';
import { sendExternalMessage } from 'scripts/Background/messaging/messenger';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { decodeFromBase64 } from 'utils/encoding';
import styles from './index.module.scss';
import { StargazerSignatureRequest } from 'scripts/Provider/constellation';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';

const SignatureRequest = () => {
  const { data: stringData } = queryString.parse(location.search);

  const {
    signatureRequestEncoded,
    asset,
    chainLabel,
    walletLabel,
  }: {
    signatureRequestEncoded: string;
    asset: string;
    chainLabel: string;
    walletLabel: string;
  } = JSON.parse(stringData as string);

  const isDAGsignature = asset === 'DAG';

  const signatureRequest = JSON.parse(
    decodeFromBase64(signatureRequestEncoded)
  ) as StargazerSignatureRequest;

  const onNegativeButtonClick = async () => {
    const { windowId }: { windowId?: string } = queryString.parse(window.location.search);

    await sendExternalMessage(ExternalMessageID.messageSigned, {
      windowId,
      result: false,
    });

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

    const { windowId }: { windowId?: string } = queryString.parse(window.location.search);
    let signature;

    try {
      signature = await signMessage(message);
    } catch (err) {
      await sendExternalMessage(ExternalMessageID.messageSigned, {
        windowId,
        result: false,
      });

      window.close();
    }

    if (signature) {
      await sendExternalMessage(ExternalMessageID.messageSigned, {
        windowId,
        result: true,
        signature: {
          hex: signature,
          requestEncoded: signatureRequestEncoded,
        },
      });
    }

    window.close();
  };

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayout
      stepLabel={``}
      originDescriptionLabel={'Requested by:'}
      headerLabel={'Signature Request'}
      footerLabel={
        'Signed messages do not incur gas fees.\nOnly sign messages on sites you trust.'
      }
      captionLabel={''}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Sign'}
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
