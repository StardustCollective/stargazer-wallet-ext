/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { useFiat } from 'hooks/usePrice';

/////////////////////////
// Component Import
/////////////////////////

import Button from 'components/Button';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
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
  // amount: string,
  // fee: string,
  // fromAddress: string,
  // toAddress: string,
  waiting: boolean,
  // transactionSigned: boolean
  messageSigned: boolean,
  walletLabel: string,
  message: string,
  onSignMessagePress: () => void,
}

/////////////////////////
// Component
/////////////////////////

const SignMessageView = ({
  // amount,
  // fee,
  // fromAddress,
  // toAddress,
  waiting,
  messageSigned,
  walletLabel,
  message,
  onSignMessagePress
}: IMessageSignViewProps) => {

  const getFiatAmount = useFiat();

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
        <section className={styles.subheading}>Ledger - Signature Request</section>
        <section className={styles.account}>
          <div className={styles.row}>
            Account: 
            <span>
              {walletLabel}
            </span>
          </div>
        </section>
        <section className={styles.message}>
          <div className={styles.messageBox}>
            <span>
              Message:
            </span>
            <p>
              {message}
            </p>
          </div>
        </section>
        <section className={styles.instruction}>
            <span>
              Please connect your Ledger device and open the Constellation app to sign the message.
            </span>
          </section>
          <div className={styles.actions}>
            <Button type="submit" variant={styles.button} onClick={onSignMessagePress}>
              Sign
            </Button>
          </div>
        {waiting &&
          <div className={styles.progressWrapper}>
            <div className={styles.progress}>
              <div>
                <CircularProgress />
              </div>
              <div>
                <span>Waiting For Ledger</span>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );

}

export default SignMessageView;