import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import Layout from 'scenes/common/Layout';
import Button from 'components/Button';

import CheckIcon from '@material-ui/icons/CheckCircle';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';

import { AssetType } from 'state/vault/types';

import { ellipsis } from '../../helpers';

import styles from './Confirm.scss';

interface ISendConfirm {
  navigation: any
}

const SendConfirm = ({ 
  isExternalRequest,
  confirmed,
  tempTx,
  assetInfo,
  getSendAmount,
  activeWallet,
  feeUnit,
  getFeeAmount,
  getTotalAmount,
  handleCancel,
  handleConfirm,
  disabled
 }: ISendConfirm) => {

  return confirmed ? (
    <Layout title="Your transaction is underway">
      <CheckIcon className={styles.checked} />
      <div className="body-description">
        You can follow your transaction under activity on your account screen.
      </div>
      <Button type="button" variant={styles.next} linkTo="/asset">
        Next
      </Button>
    </Layout>
  ) : (
    <div className={styles.wrapper}>
      {!isExternalRequest &&
        < section className={styles.txAmount}>
          <div className={styles.iconWrapper}>
            <UpArrowIcon />
          </div>
          {tempTx?.amount}{' '}
          {assetInfo.symbol}
          <small>
            (≈
            {getSendAmount()})
          </small>
        </section>
      }
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>
            {activeWallet?.label || ''} ({ellipsis(tempTx!.fromAddress)})
          </span>
        </div>
        <div className={styles.row}>
          To
          <span>{tempTx!.toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span className={styles.fee}>
            {`${tempTx!.fee} ${feeUnit} (≈ ${getFeeAmount()})`}
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>{`$${getTotalAmount()}`}</span>
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleConfirm} disabled={disabled}>
            {assetInfo.type === AssetType.Ledger ? 'Next' : 'Confirm'}
          </Button>
        </div>
      </section>
    </div >
  );
};

export default SendConfirm;
