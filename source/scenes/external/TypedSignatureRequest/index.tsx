//////////////////////
// Modules Imports
/////////////////////

import React from 'react';
import queryString from 'query-string';
import { browser } from 'webextension-polyfill-ts';

//////////////////////
// Common Layouts
/////////////////////

import CardLayout from 'scenes/external/Layouts/CardLayout'

///////////////////////////
// Styles
///////////////////////////

import styles from './index.module.scss';

import { EIP712Domain, TypedSignatureRequest } from './types';

//////////////////////
// Component
/////////////////////

const TypedSignatureRequestScreen = () => {
  //////////////////////
  // Hooks
  /////////////////////


  const { data: stringData } = queryString.parse(location.search);

  const { signatureConsent: signatureRequest, domain }:
    { signatureConsent: TypedSignatureRequest, domain: EIP712Domain } = JSON.parse(stringData as string);


  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const { windowId } = queryString.parse(window.location.search);
    const denied = new CustomEvent('signTypedMessageResult', {
      detail: { windowId, result: false }
    });

    background.dispatchEvent(denied);
    window.close();
  };

  const onPositiveButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();

    const { windowId } = queryString.parse(window.location.search);

    const approved = new CustomEvent('signTypedMessageResult', {
      detail: { windowId, result: true }
    });

    background.dispatchEvent(approved);
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
      footerLabel={'Signed messages do not incur gas fees.\nOnly sign messages on sites you trust.'}
      captionLabel={''}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Sign'}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <section>
          <label>
            Account
          </label>
          <div>
            {signatureRequest.signer}
          </div>
        </section>
        <section className={styles.message}>
          <label>
            Message
          </label>
          <div>
            {signatureRequest.content}
          </div>
        </section>
        <section className={styles.domain}>
          <label>
            Domain
          </label>
          <div>
            {domain}
          </div>
        </section>
        {signatureRequest.data && Object.keys(signatureRequest.data).length > 0 && <section className={styles.metadata}>
            <label>
              Metadata
            </label>
            <div>
              {Object.entries(signatureRequest.data).map(
                ([key, value]) => (<small>{key} = {value}</small>)
              )}
            </div>
          </section>}
      </div>
    </CardLayout>
  );
};

export * from './types'
export default TypedSignatureRequestScreen;
