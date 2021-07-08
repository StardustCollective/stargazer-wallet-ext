/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { useFiat } from 'hooks/usePrice';
import clsx from 'clsx';

/////////////////////////
// Component Import
/////////////////////////

import Button from 'components/Button';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Constants
/////////////////////////

/////////////////////////
// Interface
/////////////////////////

interface ISignViewProps {
  amount: number,
  fee: number,
  fromAddress: string,
  toAddress: string,
  onSignPress: () => {},
}

/////////////////////////
// Component
/////////////////////////

const SignView = ({ amount, fee, fromAddress, toAddress, onSignPress}: ISignViewProps) => {

  const getFiatAmount = useFiat();

  return (
    <div className={styles.wrapper}>
      <section className={styles.subheading}>Ledger - Sign Transaction</section>
      <section className={styles.txAmount}>
        <div className={styles.iconWrapper}>
          <UpArrowIcon />
        </div>
        {Number(amount || 0) + Number(fee || 0)} DAG
        <small>
          (≈
          {getFiatAmount(
            Number(amount || 0) + Number(fee || 0),
            8
          )}
          )
        </small>
      </section>
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>
          {fromAddress}
          </span>
        </div>
        <div className={styles.row}>
          To
          <span>{toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span>
            {fee} DAG (≈ {getFiatAmount(fee || 0, 8)})
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>
            {getFiatAmount(
              Number(amount || 0) + Number(fee || 0),
              8
            )}
          </span>
        </div>
        <section className={styles.instruction}>
          <span> 
            Please connect your Ledger device and open the Constellation app to sign the transaction.
          </span>
        </section>
        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            linkTo="/send"
          >
            Cancel
          </Button>
          <Button type="submit" variant={styles.button} onClick={onSignPress}>
            Sign
          </Button>
        </div>
      </section>
    </div>
  );

}

export default SignView;