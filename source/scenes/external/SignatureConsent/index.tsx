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

import { SignatureConsent } from './types';

//////////////////////
// Component
/////////////////////

const SignatureConsentScreen = () => {
  //////////////////////
  // Hooks
  /////////////////////


  const { data: stringData } = queryString.parse(location.search);

  const { signatureConsent }:
    { signatureConsent: SignatureConsent } = JSON.parse(stringData as string);


  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const { windowId } = queryString.parse(window.location.search);
    const denied = new CustomEvent('signatureConsentResult', {
      detail: { windowId, result: false }
    });

    background.dispatchEvent(denied);
    window.close();
  };

  const onPositiveButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();

    const { windowId } = queryString.parse(window.location.search);

    const approved = new CustomEvent('signatureConsentResult', {
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
            {signatureConsent.signer}
          </div>
        </section>
        <section className={styles.message}>
          <label>
            Message
          </label>
          <div>
            {signatureConsent.content}
          </div>
        </section>
        {signatureConsent.data && Object.keys(signatureConsent.data).length > 0 && <section className={styles.metadata}>
          <label>
            Metadata
          </label>
          <div>
            {Object.entries(signatureConsent.data).map(
              ([key, value]) => (<small>{key} = {value}</small>)
            )}
          </div>
        </section>}
      </div>
    </CardLayout>
  );
};

export * from './types'
export default SignatureConsentScreen;
