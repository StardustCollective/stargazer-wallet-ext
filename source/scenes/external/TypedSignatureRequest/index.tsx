import React from 'react';
import { useSelector } from 'react-redux';
import * as ethers from 'ethers';
import TextV3 from 'components/TextV3';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import CardLayoutV2 from 'scenes/external/Layouts/CardLayoutV2';
import { useCopyClipboard } from 'hooks/index';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ALL_EVM_CHAINS } from 'constants/index';
import dappSelectors from 'selectors/dappSelectors';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { ecsign, toRpcSig } from 'ethereumjs-util';
import { getWallet, preserve0x, remove0x } from 'scripts/Provider/evm';
import { ISignTypedDataParams, MessagePayload } from './types';
import styles from './index.module.scss';

const DOMAIN_TITLE = 'Domain';
const URL_TITLE = 'URL';
const CHAIN_TITLE = 'Chain';
const CONTRACT_TITLE = 'Contract';

const TypedSignatureRequestScreen = () => {
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<ISignTypedDataParams>(
      location.href
    );

  const { payload } = data;

  const payloadDecoded: MessagePayload = JSON.parse(payload);

  const domainObject = payloadDecoded.domain;
  const typesObject = payloadDecoded.types;
  const messageObject = payloadDecoded.message;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      requestMessage
    );
    window.close();
  };

  const signTypedData = (
    domain: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[0],
    types: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[1],
    value: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[2]
  ) => {
    const wallet = getWallet();
    const privateKeyHex = remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);

    const { v, r, s } = ecsign(Buffer.from(remove0x(msgHash), 'hex'), privateKey);
    const sig = preserve0x(toRpcSig(v, r, s));

    return sig;
  };

  const onPositiveButtonClick = async () => {
    try {
      const typesWithoutEIP712Domain = { ...typesObject };
      if ('EIP712Domain' in typesWithoutEIP712Domain) {
        delete typesWithoutEIP712Domain.EIP712Domain;
      }
      const signature = signTypedData(
        domainObject,
        typesWithoutEIP712Domain,
        messageObject
      );
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(signature, requestMessage);
    } catch (e) {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(e, requestMessage);
    }

    window.close();
  };

  const renderObject = (object: any, identation: number, components: any) => {
    if (typeof object === 'object') {
      Object.keys(object).forEach((key) => {
        let value = object[key];

        const showValue = typeof value !== 'object' || Array.isArray(value);

        // Transform array to string value
        if (Array.isArray(value)) {
          value = `[${value.toString()}]`;
        }

        // Create component
        const component = (
          <div
            key={`${key}-${value}`}
            className={styles.keyContainer}
            style={{ paddingLeft: identation * 8 }}
          >
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.key}>
              {key}
            </TextV3.Caption>
            {!!showValue && (
              <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{value}</TextV3.Caption>
            )}
          </div>
        );

        components.push(component);

        // Only iterate again if it's an object
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          renderObject(value, identation + 1, components);
        }
      });
    }

    return components;
  };

  const renderHeaderInfo = () => {
    if (!domainObject) return null;

    const { verifyingContract: contractAddress, chainId, name } = domainObject || {};

    if (!contractAddress || !chainId || !origin || !name) return null;

    const formattedAddress = `${contractAddress.substring(
      0,
      6
    )}...${contractAddress.substring(
      contractAddress.length - 6,
      contractAddress.length
    )}`;
    const chainLabel = Object.values(ALL_EVM_CHAINS).find(
      (chain: any) => chain.chainId.toString() === domainObject.chainId.toString()
    )?.label;

    return (
      <div className={styles.domainContainer}>
        {!!name && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              {DOMAIN_TITLE}
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>
              {name}
            </TextV3.CaptionRegular>
          </div>
        )}
        {!!origin && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              {URL_TITLE}
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoValue}
            >
              {origin}
            </TextV3.CaptionRegular>
          </div>
        )}
        {!!chainLabel && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              {CHAIN_TITLE}
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>
              {chainLabel}
            </TextV3.CaptionRegular>
          </div>
        )}
        {!!contractAddress && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              {CONTRACT_TITLE}
            </TextV3.CaptionStrong>
            <Tooltip title={textTooltip} placement="bottom" arrow>
              <div
                className={styles.contractAddress}
                onClick={() => copyAddress(contractAddress)}
              >
                <img className={styles.copyIcon} src={`/${CopyIcon}`} alt="copy" />
                <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>
                  {formattedAddress}
                </TextV3.CaptionRegular>
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    );
  };

  const initialMessageIdentationValue = 1;
  const initialMessageComponentsArray: any = [];

  return (
    <CardLayoutV2
      stepLabel=""
      headerLabel="Signature Request"
      headerInfo={renderHeaderInfo()}
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
        <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          Message
        </TextV3.LabelSemiStrong>
        {renderObject(
          messageObject,
          initialMessageIdentationValue,
          initialMessageComponentsArray
        )}
      </div>
    </CardLayoutV2>
  );
};

export * from './types';
export default TypedSignatureRequestScreen;
