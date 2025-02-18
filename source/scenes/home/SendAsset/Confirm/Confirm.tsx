import React from 'react';
import clsx from 'clsx';
import Layout from 'scenes/common/Layout';
import Button from 'components/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import Modal from 'components/Modal';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { convertBigNumber } from 'utils/number';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './Confirm.scss';
import { ellipsis } from '../../helpers';
import { DAG_SMALL_FEE } from './Confirm.container';
import { ISendConfirm } from './types';

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
  isTransfer,
  isModalVisible,
  setIsModalVisible,
  getDagSmallFeeAmount,
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
  const amountPrice = getSendAmount();
  const feeBN = convertBigNumber(tempTx?.fee);
  const feePrice = getFeeAmount();
  const totalAmount = getTotalAmount();

  return (
    <>
      {confirmed ? (
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
              <div className={styles.feeValue}>
                <span className={styles.fee}>{`${feeBN} ${feeUnit}`}</span>
                <span>{`${isL0token ? '' : `(≈ $${feePrice} USD)`}`}</span>
              </div>
            </div>
          </section>
          <section className={styles.confirm}>
            {!isTransfer && (
              <div className={styles.row}>
                Max Total
                <span>
                  {isL0token
                    ? `${totalAmount} ${assetInfo.symbol}`
                    : `$${totalAmount} USD`}
                </span>
              </div>
            )}
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
      )}
      <Modal visible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <div className={styles.modalContent}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.modalTitle}>
            Feeless Transaction Limit Reached
          </TextV3.BodyStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.modalDescription}
          >
            Hi there!{' '}
            <TextV3.CaptionRegular
              color={COLORS_ENUMS.SECONDARY_TEXT}
              extraStyles={styles.textBold}
            >
              To keep the network secure
            </TextV3.CaptionRegular>
            , feeless transactions have limits for lower balances. No worries — you’re not
            doing anything wrong!
          </TextV3.CaptionRegular>

          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            You can:
          </TextV3.CaptionRegular>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.modalDescription}
          >
            1. Add a small fee (
            <TextV3.CaptionRegular
              color={COLORS_ENUMS.SECONDARY_TEXT}
              extraStyles={styles.textBold}
            >
              {DAG_SMALL_FEE} DAG
            </TextV3.CaptionRegular>
            , ≈ ${getDagSmallFeeAmount()} USD) to continue now.
          </TextV3.CaptionRegular>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.modalDescription}
          >
            2. Wait a bit — your feeless limit will refresh soon.
          </TextV3.CaptionRegular>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Try again"
            extraStyle={styles.modalButton}
            onClick={() => {
              setIsModalVisible(false);
              handleCancel();
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default SendConfirm;
