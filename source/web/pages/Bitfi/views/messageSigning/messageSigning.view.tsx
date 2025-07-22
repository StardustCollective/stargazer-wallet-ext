import 'assets/styles/global.scss';

import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';
import React from 'react';
import { useSelector } from 'react-redux';

import SignMessageContainer, { SignMessageProviderConfig } from 'scenes/external/SignMessage/SignMessageContainer';

import walletsSelectors from 'selectors/walletsSelectors';

import styles from './styles.module.scss';

interface IMessageSignViewProps {
  waiting: boolean;
  waitingMessage: string;
  messageSigned: boolean;
  code: string;
  onSignMessagePress: (deviceId: string, payload: string) => Promise<void>;
}

const MessageSigningView = ({ waiting, waitingMessage, messageSigned, code, onSignMessagePress }: IMessageSignViewProps) => {
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);

  const bitfiSigningConfig: SignMessageProviderConfig = {
    title: 'Bitfi - Sign Message',
    footer: 'Please connect your Bitfi device to WiFI to sign the message. Only sign messages on sites you trust.',
    onSign: async ({ payload }) => {
      // Delegate to the parent component's signing logic
      await onSignMessagePress(deviceId, payload);
      return ''; // The actual signature is handled by the parent
    },
    onSuccess: async () => {
      // Success is handled by the parent component
    },
    onError: async () => {
      // Error is handled by the parent component
    },
  };

  return messageSigned ? (
    <div className={styles.layout}>
      <section className={styles.heading}>
        <span className="heading-1">Message has been signed</span>
      </section>
      <section className={styles.content}>
        <CheckIcon className={styles.checked} />
        <div className="body-description">Your signature has been sent for verification.</div>
      </section>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <SignMessageContainer {...bitfiSigningConfig} />
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
