import React, { useState } from 'react';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import CardLayoutV3 from '../Layouts/CardLayoutV3';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import { useSelector } from 'react-redux';
import dappSelectors from 'selectors/dappSelectors';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPRpcError } from 'scripts/common';
import { decodeFromBase64 } from 'utils/encoding';
import styles from './index.scss';
import walletsSelectors from 'selectors/walletsSelectors';
import { buildTransactionBody, sendMetagraphDataTransaction } from './utils';
import { isAxiosError } from 'axios';
import { usePlatformAlert } from 'utils/alertUtil';
import { toDatum } from 'utils/number';
import { SendDataFeeResponse, SignDataFeeResponse } from './types';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { useCopyClipboard } from 'hooks/index';

const SendMetagraphData = () => {
  const assets = useSelector(walletsSelectors.getAssets);
  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;
  const showAlert = usePlatformAlert();

  const [isObjectCopied, copyObject] = useCopyClipboard(1000);
  const textTooltip = isObjectCopied ? 'Copied' : 'Copy object';

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

  const title = sign ? 'SignDataTransaction' : 'SendDataTransaction';

  const [fee, setFee] = useState(feeAmount);

  const metagraphInfo = Object.values(assets).find(
    (asset) => asset?.address === metagraphId
  );

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

  const renderMetagraphValue = () => {
    return (
      <div className={styles.valueContainer}>
        <img src={metagraphInfo.logo} alt="Metagraph logo" className={styles.logo} />
        <TextV3.CaptionRegular extraStyles={styles.label}>
          {metagraphInfo.label}
        </TextV3.CaptionRegular>
      </div>
    );
  };

  return (
    <CardLayoutV3
      logo={current?.logo}
      title={title}
      subtitle={origin}
      fee={{
        show: true,
        defaultValue: feeAmount,
        value: fee,
        symbol: metagraphInfo?.symbol,
        disabled: feeAmount === '0',
        setFee,
      }}
      onNegativeButtonClick={onNegativeButtonClick}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={walletLabel} />
          <CardRow label="Network:" value={chainLabel} />
          <CardRow label="Metagraph:" value={renderMetagraphValue()} />
        </Card>
        <Card>
          <div className={styles.titleContainer}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
              Transaction data:
            </TextV3.CaptionStrong>
            <Tooltip title={textTooltip} placement="bottom" arrow>
              <div onClick={() => copyObject(message)} className={styles.copyIcon}>
                <img src={`/${CopyIcon}`} alt="Copy" />
              </div>
            </Tooltip>
          </div>
          <TextV3.CaptionRegular extraStyles={styles.message}>
            {message}
          </TextV3.CaptionRegular>
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default SendMetagraphData;
