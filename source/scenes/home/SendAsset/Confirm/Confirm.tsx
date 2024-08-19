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
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import styles from './Confirm.scss';
import { ellipsis } from '../../helpers';
import { convertBigNumber } from 'utils/number';

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
  handleConfirm: (
    callbackSuccess: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null,
    callbackError: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null
  ) => void;
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
  const callbackSuccess = async (
    message: StargazerRequestMessage,
    _origin: string,
    trxHash: string
  ) => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseResult(trxHash, message);
    window.close();
  };

  const callbackError = async (
    message: StargazerRequestMessage,
    _origin: string,
    error: string
  ) => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError(error, EIPErrorCodes.Rejected),
      message
    );
  };

  const transactionWrapper = clsx(styles.transaction, {
    [styles.externalRequestExtra]: isExternalRequest,
  });

  const fromRowStyles = clsx(styles.row, {
    [styles.fromRow]: isExternalRequest,
  });

  const amountBN = convertBigNumber(tempTx?.amount);
  const amountPrice = convertBigNumber(getSendAmount());
  const feeBN = convertBigNumber(tempTx?.fee);
  const feePrice = convertBigNumber(getFeeAmount());
  const totalAmount = convertBigNumber(getTotalAmount());

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
          {amountBN} {assetInfo.symbol}
          {!isL0token && <small>(≈ ${amountPrice} USD)</small>}
        </section>
      )}
      <section className={transactionWrapper}>
        <div className={fromRowStyles}>
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
            {`${feeBN} ${feeUnit} ${isL0token ? '' : `(≈ $${feePrice} USD)`}`}
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>
            {isL0token ? `${totalAmount} ${assetInfo.symbol}` : `$${totalAmount} USD`}
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
