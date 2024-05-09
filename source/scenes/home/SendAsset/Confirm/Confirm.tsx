import React from 'react';
import clsx from 'clsx';
import Layout from 'scenes/common/Layout';
import Button from 'components/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import { IActiveAssetState, IWalletState } from 'state/vault/types';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { ITransactionInfo } from 'scripts/types';
import { IAssetInfoState } from 'state/assets/types';
import { ellipsis } from '../../helpers';
import styles from './Confirm.scss';
import { sendExternalMessage } from 'scripts/Background/messaging/messenger';
import { ExternalMessageID } from 'scripts/Background/messaging/types';

interface ISendConfirm {
  isExternalRequest: boolean;
  confirmed: boolean;
  tempTx: ITransactionInfo;
  assetInfo: IAssetInfoState;
  activeAsset?: IAssetInfoState | IActiveAssetState;
  getSendAmount: () => any;
  activeWallet: IWalletState;
  feeUnit: string;
  getFeeAmount: () => any;
  getTotalAmount: () => any;
  handleCancel: () => void;
  handleConfirm: (callbackSuccess: any, callbackError: any) => void;
  disabled: boolean;
  isL0token: boolean;
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
  disabled,
  isL0token,
}: ISendConfirm) => {
  const callbackSuccess = async (windowId: string, trxHash: string) => {
    await sendExternalMessage(ExternalMessageID.transactionSent, {
      windowId,
      approved: true,
      trxHash,
    });
  };
  const callbackError = async (windowId: string, error: string) => {
    await sendExternalMessage(ExternalMessageID.transactionSent, {
      windowId,
      approved: false,
      error,
    });
  };

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
      {!isExternalRequest && (
        <section className={styles.txAmount}>
          <div className={styles.iconWrapper}>
            <UpArrowIcon />
          </div>
          {tempTx?.amount} {assetInfo.symbol}
          {!isL0token && (
            <small>
              (≈
              {getSendAmount()})
            </small>
          )}
        </section>
      )}
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>
            {activeWallet?.label || ''} ({ellipsis(tempTx?.fromAddress)})
          </span>
        </div>
        <div className={styles.row}>
          To
          <span>{tempTx?.toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span className={styles.fee}>
            {`${tempTx?.fee} ${feeUnit} ${isL0token ? '' : `(≈ ${getFeeAmount()})`}`}
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>
            {isL0token
              ? `${getTotalAmount()} ${assetInfo.symbol}`
              : `$${getTotalAmount()}`}
          </span>
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
          <Button
            type="submit"
            variant={styles.button}
            onClick={() => handleConfirm(callbackSuccess, callbackError)}
            disabled={disabled}
          >
            {activeWallet.type === KeyringWalletType.LedgerAccountWallet ||
            activeWallet.type === KeyringWalletType.BitfiAccountWallet
              ? 'Next'
              : 'Confirm'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SendConfirm;
