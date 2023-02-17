//////////////////////
// Modules Imports
/////////////////////

import React from 'react';
import queryString from 'query-string';
import { browser } from 'webextension-polyfill-ts';
import clsx from 'clsx';

//////////////////////
// Components
/////////////////////

import TextV3 from 'components/TextV3';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';

//////////////////////
// Common Layouts
/////////////////////

import CardLayoutV2 from 'scenes/external/Layouts/CardLayoutV2';

//////////////////////
// Hooks
/////////////////////

import { useController, useCopyClipboard } from 'hooks/index';

///////////////////////////
// Styles
///////////////////////////

import styles from './index.module.scss';

import { EIP712Domain, TypedSignatureRequest } from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ALL_EVM_CHAINS } from 'constants/index';

const DOMAIN_TITLE = 'Domain';
const URL_TITLE = 'URL';
const CHAIN_TITLE = 'Chain';
const CONTRACT_TITLE = 'Contract';

//////////////////////
// Component
/////////////////////

const TypedSignatureRequestScreen = () => {
  //////////////////////
  // Hooks
  /////////////////////
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';


  const { data: stringData } = queryString.parse(location.search);

  
  const { signatureConsent: signatureRequest, domain }:
  { signatureConsent: TypedSignatureRequest, domain: string } = JSON.parse(stringData as string);
  
  const contentObject = JSON.parse(signatureRequest.content);
  const metadataObject =  signatureRequest.data;
  const domainObject = JSON.parse(domain) as EIP712Domain;

  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

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

  const renderObject = (object: any, identation: number, components: any) => {
    if (typeof object === 'object') {
      Object.keys(object).forEach(key => {

        let value = object[key];

        const showValue = typeof value !== 'object' || Array.isArray(value);

        // Transform array to string value
        if (Array.isArray(value)) {
          value = `[${value.toString()}]`;
        }
        
        // Create component
        const component = 
          <div className={styles.keyContainer} style={{ paddingLeft: identation * 8 }}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.key}>{key}</TextV3.Caption>
            {!!showValue && (
              <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{value}</TextV3.Caption>
            )}
          </div>;

        components.push(component);

        // Only iterate again if it's an object
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          renderObject(value, identation + 1, components);
        }
      })
    }

    return components;
  }

  const renderHeaderInfo = () => {
    if (!domainObject) return null;

    const contractAddress = domainObject.verifyingContract;
    const formattedAddress = `${contractAddress.substring(0, 6)}...${contractAddress.substring(contractAddress.length - 6, contractAddress.length)}`;
    const chainLabel = Object.values(ALL_EVM_CHAINS).find((chain: any) => chain.chainId.toString() === domainObject.chainId.toString())?.label;

    return (
      <div className={styles.domainContainer}>
        {!!domainObject.name && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>{DOMAIN_TITLE}</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>{domainObject.name}</TextV3.CaptionRegular>
          </div>
        )}
        {!!origin && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>{URL_TITLE}</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoValue}>{origin}</TextV3.CaptionRegular>
          </div>
        )}
        {!!chainLabel && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>{CHAIN_TITLE}</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>{chainLabel}</TextV3.CaptionRegular>
          </div>
        )}
        {!!contractAddress && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>{CONTRACT_TITLE}</TextV3.CaptionStrong>
            <Tooltip title={textTooltip} placement="bottom" arrow>
              <div className={styles.contractAddress} onClick={() => copyAddress(contractAddress)}>
                <img className={styles.copyIcon} src={`/${CopyIcon}`} alt="copy" />
                <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>{formattedAddress}</TextV3.CaptionRegular>
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    )
  }

  //////////////////////
  // Renders
  /////////////////////
  const initialMessageIdentationValue = 1;
  const initialMessageComponentsArray: any = [];
  const initialMetadataIdentationValue = 1;
  const initialMetadataComponentsArray: any = [];

  return (
    <CardLayoutV2
      stepLabel={``}
      headerLabel={'Signature Request'}
      headerInfo={renderHeaderInfo()}
      footerLabel={'Signed messages do not incur gas fees.\nOnly sign messages on sites you trust.'}
      captionLabel={``}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Sign'}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>Message</TextV3.LabelSemiStrong>
        {renderObject(contentObject, initialMessageIdentationValue, initialMessageComponentsArray)}
        {!!metadataObject && (
          <>
            <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK} extraStyles={clsx(styles.title, styles.metadata)}>Metadata</TextV3.LabelSemiStrong>
            {renderObject(metadataObject, initialMetadataIdentationValue, initialMetadataComponentsArray)}
          </>
        )}
      </div>
    </CardLayoutV2>
  );
};

export * from './types'
export default TypedSignatureRequestScreen;
