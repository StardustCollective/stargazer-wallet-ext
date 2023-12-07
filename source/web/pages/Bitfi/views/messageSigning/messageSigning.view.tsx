/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';

/////////////////////////
// Component Import
/////////////////////////

import Button from 'components/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';
import 'assets/styles/global.scss';

/////////////////////////
// Interface
/////////////////////////

interface IMessageSignViewProps {
  waiting: boolean;
  waitingMessage: string;
  messageSigned: boolean;
  walletLabel: string;
  deviceId: string;
  code: string;
  message: {
    content: string;
    metadata: {
      projectId: string;
      nodes: number;
      fee: number;
    };
  };
  onSignMessagePress: () => void;
}

/////////////////////////
// Component
/////////////////////////

const SignMessageView = ({
  waiting,
  waitingMessage,
  messageSigned,
  walletLabel,
  code,
  message,
  deviceId,
  onSignMessagePress,
}: IMessageSignViewProps) => {
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
    <>
      <div className={styles.wrapper}>
        <section className={styles.subheading}>Bitfi - Signature Request</section>
        <section className={styles.account}>
          <div className={styles.row}>
            Account:
            <span>{walletLabel}</span>
          </div>
        </section>
        <section className={styles.account}>
          <div className={styles.row}>
            Device ID:
            <span>{deviceId}</span>
          </div>
        </section>
        <section className={styles.message}>
          <div className={styles.messageBox}>
            <div className={styles.messageContent}>
              <span className={styles.key}>Message:</span>
              <br />
              <p>{message.content}</p>
            </div>
            <div className={styles.messageContent}>
              <span className={styles.key}>Meta Data:</span>
              <br />
              <p>
                projectId = {message.metadata.projectId}
                <br />
                nodes = {message.metadata.nodes}
                <br />
                fee = {message.metadata.fee}
              </p>
            </div>
          </div>
        </section>
        <section className={styles.instruction}>
          <span>
            Please connect your Bitfi device to WiFI to sign the message. Only sign
            messages on sites you trust.
          </span>
        </section>
        <div className={styles.actions}>
          <Button type="submit" variant={styles.button} onClick={onSignMessagePress}>
            Sign
          </Button>
        </div>
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
    </>
  );
};

export default SignMessageView;
