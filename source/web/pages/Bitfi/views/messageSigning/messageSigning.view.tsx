import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';
import styles from './styles.module.scss';
import 'assets/styles/global.scss';
import { StargazerSignatureRequest } from 'scripts/Provider/constellation';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { decodeFromBase64 } from 'utils/encoding';
import SignMessageView, { ISignMessageProps } from 'scenes/external/views/sign-message';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';

interface IMessageSignViewProps {
  waiting: boolean;
  waitingMessage: string;
  messageSigned: boolean;
  code: string;
  onSignMessagePress: () => Promise<void>;
}

const MessageSigningView = ({
  waiting,
  waitingMessage,
  messageSigned,
  code,
  onSignMessagePress,
}: IMessageSignViewProps) => {
  const { data, message: messageRequest } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<{
      deviceId: string;
      payload: string;
      wallet: string;
      chain: string;
    }>(location.href);

  const onReject = () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  };

  const { deviceId, payload, wallet, chain } = data;

  const payloadDecoded = JSON.parse(
    decodeFromBase64(payload)
  ) as StargazerSignatureRequest;

  const props: ISignMessageProps = {
    title: 'Bitfi - Signature Request',
    deviceId,
    account: wallet,
    network: chain,
    message: payloadDecoded,
    footer:
      'Please connect your Bitfi device to WiFI to sign the message. Only sign messages on sites you trust.',
    onSign: onSignMessagePress,
    onReject: onReject,
  };

  return messageSigned ? (
    <div className={styles.layout}>
      <section className={styles.heading}>
        <span className="heading-1">Message has been signed</span>
      </section>
      <section className={styles.content}>
        <CheckIcon className={styles.checked} />
        <div className="body-description">
          Your signature has been sent for verification.
        </div>
      </section>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <SignMessageView {...props} />
      {waiting && (
        <div className={styles.progressWrapper}>
          <div className={styles.progress}>
            <CircularProgress />
            <h1 style={{ color: 'white', margin: '0px' }}>{code}</h1>
            <span>{waitingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSigningView;
