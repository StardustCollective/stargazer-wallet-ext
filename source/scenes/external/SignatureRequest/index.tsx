//////////////////////
// Modules Imports
/////////////////////

import React from 'react';

//////////////////////
// Common Layouts
/////////////////////

import CardLayout from 'scenes/external/Layouts/CardLayout';

///////////////////////////
// Styles
///////////////////////////

import { StargazerSignatureRequest } from 'scripts/Provider/StargazerProvider';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import styles from './index.module.scss';

//////////////////////
// Component
/////////////////////

const SignatureRequest = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const { data, message, origin } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<{
      signatureRequestEncoded: string;
      asset: string;
      provider: string;
      chainLabel: string;
    }>(location.href);

  const {
    signatureRequestEncoded,
    // asset,
    // provider,
    chainLabel,
  } = data;
  // TODO-349: Check how signature should work here
  // const PROVIDERS: { [provider: string]: StargazerProvider | EVMProvider } = {
  //   [ProtocolProvider.CONSTELLATION]: controller.stargazerProvider,
  //   [ProtocolProvider.ETHEREUM]: controller.ethereumProvider,
  // };
  // const providerInstance = PROVIDERS[provider];
  // const account = providerInstance.getAssetByType(
  //   asset === 'DAG' ? AssetType.Constellation : AssetType.Ethereum
  // );
  const signatureRequest = JSON.parse(
    window.atob(signatureRequestEncoded)
  ) as StargazerSignatureRequest;

  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );
    window.close();
  };

  const onPositiveButtonClick = async () => {
    // const message = asset === 'DAG' ? signatureRequestEncoded : signatureRequest.content;
    // const signature = providerInstance.signMessage(message);

    const signature = {
      hex: 'test',
      requestEncoded: signatureRequestEncoded,
    };

    StargazerWSMessageBroker.sendResponseResult(signature.hex, message);

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
          <div>
            {/* {wallets.find((w) => w.address === account.address)?.label ?? account.address} */}
            Account label
          </div>
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
