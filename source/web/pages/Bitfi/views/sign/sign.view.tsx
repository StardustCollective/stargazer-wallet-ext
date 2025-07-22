import 'assets/styles/global.scss';

import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { dag4 } from '@stardust-collective/dag4';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import SignTransactionContainer, { SignTransactionProviderConfig } from 'scenes/external/SignTransaction/SignTransactionContainer';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';

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
  const dagAddress = useSelector(walletsSelectors.selectActiveWalletDagAddress);
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);

  const bitfiSigningConfig: SignTransactionProviderConfig = {
    title: 'Bitfi - Sign Transaction',
    footer: 'Please connect your Bitfi device to WiFI to sign the transaction. Only sign transactions on sites you trust.',
    onSignTransaction: async ({ decodedData, isDAG, isMetagraph, isEvmNative, fee, wallet }) => {
      if (isDAG) {
        const { address, chainId, chain } = wallet;
        const networkInfo = dag4.account.networkInstance.getNetwork();

        if (chain !== StargazerChain.CONSTELLATION) {
          throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
        }

        if (dagAddress.toLowerCase() !== address.toLowerCase()) {
          throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
        }

        if (chainId !== DAG_NETWORK[networkInfo.id].chainId) {
          throw new EIPRpcError('Connected network mismatch', EIPErrorCodes.Unauthorized);
        }
        const { value, from, to } = decodedData.transaction;
        await onSignPress(deviceId, value, from, to, fee);
      }

      if (isMetagraph) {
        throw new EIPRpcError('Metagraph transactions not supported with Bitfi hardware wallet', EIPErrorCodes.Unsupported);
      }

      if (isEvmNative) {
        throw new EIPRpcError('EVM transactions not supported with Bitfi hardware wallet', EIPErrorCodes.Unsupported);
      }

      throw new EIPRpcError('Unsupported transaction type', EIPErrorCodes.Unsupported);
    },
    onSuccess: async () => {
      // Success is handled by the parent component
    },
    onError: async () => {
      // Error is handled by the parent component
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
