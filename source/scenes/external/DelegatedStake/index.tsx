import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import Tooltip from 'components/Tooltip';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import dappSelectors from 'selectors/dappSelectors';
import assetsSelectors from 'selectors/assetsSelectors';
import styles from './index.scss';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { DelegatedStakeBody, DelegatedStakeData } from './types';
import { formatBigNumberForDisplay, toDag, toDatum } from 'utils/number';
import { dag4 } from '@stardust-collective/dag4';
import { usePlatformAlert } from 'utils/alertUtil';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { useCopyClipboard } from 'hooks/index';

const DelegatedStakeView = () => {
  const [feeValue, setFeeValue] = useState('0');
  const [stakeData, setStakeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();
  const [isObjectCopied, copyObject] = useCopyClipboard(1000);
  const textTooltip = isObjectCopied ? 'Copied' : 'Copy object';

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  // Get DAG asset information
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<DelegatedStakeData>(
      location.href
    );

  const { walletLabel, chainLabel, amount, nodeId, tokenLockRef, fee, source } = data;

  const generateJsonMessage = (data: any): string => {
    if (!data) return '';

    return JSON.stringify(data, null, 4);
  };

  useEffect(() => {
    if (!stakeData) {
      const stakeData = {
        amount: formatBigNumberForDisplay(toDag(amount)),
        fee: formatBigNumberForDisplay(toDag(fee) ?? 0),
        nodeId,
        tokenLockRef,
      };
      setStakeData(stakeData);
    }
  }, []);

  useEffect(() => {
    if (!!feeValue) {
      const stakeData = {
        amount: formatBigNumberForDisplay(toDag(amount)),
        fee: formatBigNumberForDisplay(toDag(feeValue)),
        nodeId,
        tokenLockRef,
      };
      setStakeData(stakeData);
    }
  }, [feeValue]);

  // Convert fee to DAG
  const feeAmount = toDag(fee ?? 0);

  useEffect(() => {
    if (!!feeAmount && feeAmount !== null && feeAmount !== undefined) {
      setFeeValue(feeAmount.toString());
    }
  }, [feeAmount]);

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      requestMessage
    );
    window.close();
  };

  const onPositiveButtonClick = async () => {
    setLoading(true);
    try {
      const delegatedStakeBody: DelegatedStakeBody = {
        source,
        ...stakeData,
        amount,
        fee: toDatum(feeValue),
      };

      const delegatedStakeResponse = await dag4.account.postDelegatedStake(
        delegatedStakeBody
      );

      if (!delegatedStakeResponse || !delegatedStakeResponse.hash) {
        throw new Error('Failed to generate signed delegated stake transaction');
      }

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(
        delegatedStakeResponse.hash,
        requestMessage
      );
    } catch (e) {
      const errorMessage =
        (e instanceof Error && e?.message) ||
        'There was an error with the transaction.\nPlease try again later.';
      showAlert(errorMessage, 'danger');
      setLoading(false);
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(e, requestMessage);
      return;
    }

    window.close();
  };

  const message = generateJsonMessage(stakeData);

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="DelegatedStake"
      subtitle={origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: feeValue,
        symbol: dagAsset?.symbol,
        disabled: true,
        setFee: setFeeValue,
      }}
      isPositiveButtonLoading={loading}
      onNegativeButtonClick={onNegativeButtonClick}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={walletLabel} />
          <CardRow label="Network:" value={chainLabel} />
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

export * from './types';
export default DelegatedStakeView;
