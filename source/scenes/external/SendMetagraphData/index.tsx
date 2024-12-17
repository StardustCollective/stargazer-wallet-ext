import React, { useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';

import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { useSelector } from 'react-redux';
import dappSelectors from 'selectors/dappSelectors';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPRpcError } from 'scripts/common';
import { decodeFromBase64 } from 'utils/encoding';
import styles from './index.module.scss';
import walletsSelectors from 'selectors/walletsSelectors';
import TextInput from 'components/TextInput';
import { useForm } from 'react-hook-form';
import { buildTransactionBody, sendMetagraphDataTransaction } from './utils';
import { isAxiosError } from 'axios';
import { usePlatformAlert } from 'utils/alertUtil';
import { toDatum } from 'utils/number';
import { SendDataFeeResponse, SignDataFeeResponse } from './types';

const FEE_MUST_NUMBER = 'Fee must be a valid number';
const FEE_REQUIRED = 'Fee is required';

const SendMetagraphData = () => {
  const assets = useSelector(walletsSelectors.getAssets);
  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;
  const showAlert = usePlatformAlert();

  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<{
      origin: string;
      dataEncoded: string;
      walletId: string;
      walletLabel: string;
      deviceId: string;
      bipIndex: number;
      chainLabel: string;
      metagraphId: string;
      feeAmount: string;
      sign: boolean;
      destinationFeeAddress: string;
      updateHash: string;
    }>(location.href);

  const {
    dataEncoded,
    chainLabel,
    walletLabel,
    metagraphId,
    feeAmount,
    destinationFeeAddress,
    updateHash,
    sign,
  } = data;

  const feeDisabled = feeAmount === '0';
  const title = sign ? 'Sign Data Transaction' : 'Send Data Transaction';
  const button = sign ? 'Sign' : 'Send';

  const { register, errors, setValue, triggerValidation } = useForm({
    defaultValues: {
      fee: feeAmount,
    },
    validationSchema: yup.object().shape({
      fee: yup
        .string()
        .test('number', FEE_MUST_NUMBER, (val) => {
          if (!!val) {
            const regex = new RegExp(/^\d+(\.\d+)?$/);
            return regex.test(val);
          }
          return true;
        })
        .required(FEE_REQUIRED),
    }),
  });

  const [fee, setFee] = useState(feeAmount);

  const buttonDisabled = !feeDisabled && !!errors?.fee;

  const handleFeeChange = (value: string) => {
    setValue('fee', value);
    setFee(value);
    triggerValidation('fee');
  };

  const metagraphInfo = Object.values(assets).find(
    (asset) => asset?.address === metagraphId
  );

  const metagraphLabel = metagraphInfo?.label ?? '';

  // Decode base64 data
  const dataDecoded = decodeFromBase64(dataEncoded);
  let message = dataDecoded;

  try {
    // Try to parse and check if it's a JSON object
    const parsedData = JSON.parse(dataDecoded);
    if (parsedData) {
      // Pretty-print JSON object
      message = JSON.stringify(parsedData, null, 4);
    }
  } catch (err) {
    // Decoded data is not a valid JSON
    console.log('data to parse is not valid JSON');
    message = dataDecoded;
  }

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', 4001),
      requestMessage
    );

    window.close();
  };

  const onPositiveButtonClick = async () => {
    const body = await buildTransactionBody(
      dataEncoded,
      fee,
      destinationFeeAddress,
      updateHash
    );

    const feeTooLow = !!body?.fee && body?.fee?.value?.amount < toDatum(feeAmount);
    if (feeTooLow) {
      showAlert(
        `Not enough fee for this transaction.\nThe recommended fee amount is ${feeAmount} ${metagraphInfo?.symbol}`,
        'danger'
      );
      return;
    }

    let response: SendDataFeeResponse | SignDataFeeResponse;

    try {
      response = await sendMetagraphDataTransaction(metagraphInfo.dl1endpoint, body);
    } catch (err: any) {
      if (isAxiosError(err)) {
        showAlert(
          `There was an error with the transaction.\nPlease try again later.`,
          'danger'
        );
      }
      return;
    }

    if (sign) {
      (response as SignDataFeeResponse).signature = body.data.proofs[0].signature;
      if (!!response?.feeHash) {
        (response as SignDataFeeResponse).feeSignature = body.fee.proofs[0].signature;
      }
    }

    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseResult(response, requestMessage);

    window.close();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={current.logo} className={styles.logo} alt="site logo" />
        </div>
        <div className={styles.siteContainer}>
          <TextV3.CaptionStrong extraStyles={styles.site}>{origin}</TextV3.CaptionStrong>
        </div>
        <div className={styles.titleContainer}>
          <TextV3.BodyStrong extraStyles={styles.title}>{title}</TextV3.BodyStrong>
        </div>
      </div>
      <div className={styles.content}>
        <div className={clsx(styles.infoContainer, styles.box)}>
          <div className={styles.infoItem}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Network:
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular extraStyles={styles.value}>
              {chainLabel}
            </TextV3.CaptionRegular>
          </div>
          <div className={clsx(styles.infoItem, styles.spacingTop)}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Metagraph:
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular extraStyles={styles.value}>
              {metagraphLabel}
            </TextV3.CaptionRegular>
          </div>
          <div className={clsx(styles.infoItem, styles.spacingTop)}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Wallet:
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular extraStyles={styles.value}>
              {walletLabel}
            </TextV3.CaptionRegular>
          </div>
        </div>
        <div className={clsx(styles.txData, styles.box)}>
          <div>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Transaction data:
            </TextV3.CaptionStrong>
          </div>
          <div className={styles.messageContainer}>
            <TextV3.CaptionRegular extraStyles={styles.message}>
              {message}
            </TextV3.CaptionRegular>
          </div>
        </div>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.feeTitle}>
          Transaction Fee
        </TextV3.CaptionStrong>
        <TextInput
          type="number"
          fullWidth
          inputRef={register}
          name="fee"
          value={fee}
          error={!!errors?.fee}
          onChange={(ev) => handleFeeChange(ev.target.value)}
          disabled={feeDisabled}
          endAdornment={
            <TextV3.Caption
              extraStyles={styles.recommendedLabel}
              color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
            >
              Recommended
            </TextV3.Caption>
          }
        />
        {!!errors?.fee && (
          <TextV3.Caption color={COLORS_ENUMS.RED}>{errors?.fee?.message}</TextV3.Caption>
        )}
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.recommendedFee}>
          Recommended fee: {` `}
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            {feeAmount} {metagraphInfo?.symbol}
          </TextV3.Caption>
        </TextV3.Caption>
      </div>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            label="Cancel"
            extraStyle={styles.secondary}
            onClick={onNegativeButtonClick}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            label={button}
            disabled={buttonDisabled}
            onClick={onPositiveButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SendMetagraphData;
