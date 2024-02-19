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

interface ISignViewProps {
  amount: string;
  fee: string;
  fromAddress: string;
  toAddress: string;
  waiting: boolean;
  transactionSigned: boolean;
  onSignPress: () => {};
}

/////////////////////////
// Component
/////////////////////////

const SignView = ({
  amount,
  fee,
  fromAddress,
  toAddress,
  waiting,
  transactionSigned,
  onSignPress,
}: ISignViewProps) => {
  const getFiatAmount = useFiat();

  return transactionSigned ? (
    <div className={styles.layout}>
      <section className={styles.heading}>
        <span className="heading-1">Your transaction is underway</span>
      </section>
      <section className={styles.content}>
        <CheckIcon className={styles.checked} />
        <div className="body-description">
          You can follow your transaction under activity on your account screen.
        </div>
      </section>
    </div>
  ) : (
    <>
      <div className={styles.wrapper}>
        <section className={styles.subheading}>Ledger - Sign Transaction</section>
        <section className={styles.txAmount}>
          <div className={styles.iconWrapper}>
            <UpArrowIcon />
          </div>
          {Number(amount || 0) + Number(fee || 0)} DAG
          <small>
            (≈
            {getFiatAmount(Number(amount || 0) + Number(fee || 0), 8)})
          </small>
        </section>
        <section className={styles.transaction}>
          <div className={styles.row}>
            From
            <span>{fromAddress}</span>
          </div>
          <div className={styles.row}>
            To
            <span>{toAddress}</span>
          </div>
          <div className={styles.row}>
            Transaction Fee
            <span>
              {fee} DAG (≈ {getFiatAmount(Number(fee) || 0, 8)})
            </span>
          </div>
        </section>
        <section className={styles.confirm}>
          <div className={styles.row}>
            Max Total
            <span>{getFiatAmount(Number(amount || 0) + Number(fee || 0), 8)}</span>
          </div>
        </section>
        <section className={styles.instruction}>
          <span>
            Please connect your Ledger device and open the Constellation app to sign the
            transaction.
          </span>
        </section>
        <div className={styles.actions}>
          <Button type="submit" variant={styles.button} onClick={onSignPress}>
            Sign
          </Button>
        </div>
        {waiting && (
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
        )}
      </div>
    </>
  );
};

export default SignView;
