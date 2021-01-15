import React, { useState } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Layout from 'containers/common/Layout';
import Button from 'components/Button';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import CheckIcon from 'assets/images/svg/check.svg';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';

import { ellipsis } from '../helpers';
import styles from './Confirm.scss';

const SendConfirm = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const tempTx = controller.wallet.account.getTempTx();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    controller.wallet.account.confirmTempTx().then(() => {
      setConfirmed(true);
    });
  };

  return confirmed ? (
    <Layout title="Your transaction is underway" linkTo="/remind" showLogo>
      <img src={`/${CheckIcon}`} className={styles.checked} alt="Success" />
      <div className="body-description">
        You can follow your transaction under activity on your account screen.
      </div>
      <Button type="button" variant={styles.next} linkTo="/home">
        Next
      </Button>
    </Layout>
  ) : (
    <div className={styles.wrapper}>
      <Header backLink="/send" />
      <section className={styles.subheading}>Confirm</section>
      <section className={styles.txAmount}>
        <div className={styles.iconWrapper}>
          <UpArrowIcon />
        </div>
        {tempTx!.amount} DAG
        <small>(≈ $800.10)</small>
      </section>
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>Main Wallet ({ellipsis(tempTx!.fromAddress)})</span>
        </div>
        <div className={styles.row}>
          To
          <span>{tempTx!.toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span>
            {tempTx!.fee} DAG (≈ {getFiatAmount(tempTx?.amount || 0, 8)})
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>
            {getFiatAmount((tempTx?.amount || 0) + (tempTx?.fee || 0), 8)}
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            linkTo="/send"
          >
            Close
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SendConfirm;
