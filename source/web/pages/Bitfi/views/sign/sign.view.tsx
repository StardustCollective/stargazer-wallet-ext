import 'assets/styles/global.scss';

import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';
import React from 'react';
import { useSelector } from 'react-redux';

import SignTransactionContainer, { SignTransactionProviderConfig } from 'scenes/external/SignTransaction/SignTransactionContainer';

import walletsSelectors from 'selectors/walletsSelectors';

import styles from './styles.module.scss';

interface ISignViewProps {
  code: string;
  waiting: boolean;
  waitingMessage: string;
  transactionSigned: boolean;
  onSignPress: (deviceId: string, amount: number, from: string, to: string, fee: string) => Promise<void>;
}

const SignView = ({ waiting, code, waitingMessage, transactionSigned, onSignPress }: ISignViewProps) => {
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);

  const bitfiSigningConfig: SignTransactionProviderConfig = {
    title: 'Bitfi - Sign Transaction',
    footer: 'Please connect your Bitfi device to WiFI to sign the transaction. Only sign transactions on sites you trust.',
    onSignTransaction: async ({ decodedData, isDAG, isMetagraph, isEvmNative, fee }) => {
      if (isDAG) {
        const { value, from, to } = decodedData.transaction;
        await onSignPress(deviceId, value, from, to, fee);
      }

      if (isMetagraph) {
        throw new Error('Metagraph transactions not supported with Bitfi hardware wallet');
      }

      if (isEvmNative) {
        throw new Error('EVM transactions not supported with Bitfi hardware wallet');
      }

      throw new Error('Unsupported transaction type');
    },
    onSuccess: async txHash => {
      console.log('hash', txHash);
    },
    onError: async error => {
      console.log('error', error);
    },
  };

  return transactionSigned ? (
    <div className={styles.layout}>
      <section className={styles.heading}>
        <span className="heading-1">Your transaction is underway</span>
      </section>
      <section className={styles.content}>
        <CheckIcon className={styles.checked} />
        <div className="body-description">You can follow your transaction under activity on your account screen.</div>
      </section>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <SignTransactionContainer {...bitfiSigningConfig} />
      {waiting && (
        <div className={styles.progressWrapper}>
          <div className={styles.progress}>
            <div>
              <CircularProgress />
            </div>
            <div className={styles.message}>
              <h1 style={{ color: 'white', margin: '0px' }}>{code}</h1>
              <span>{waitingMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignView;
