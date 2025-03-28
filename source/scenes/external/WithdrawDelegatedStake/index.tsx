import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import Tooltip from 'components/Tooltip';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import dappSelectors from 'selectors/dappSelectors';
import assetsSelectors from 'selectors/assetsSelectors';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { WithdrawDelegatedStakeBody, WithdrawDelegatedStakeData } from './types';
import { dag4 } from '@stardust-collective/dag4';
import { usePlatformAlert } from 'utils/alertUtil';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { useCopyClipboard } from 'hooks/index';
import styles from './index.scss';

const WithdrawDelegatedStakeView = () => {
  const [feeValue, setFeeValue] = useState('0');
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();
  const [isObjectCopied, copyObject] = useCopyClipboard(1000);
  const textTooltip = isObjectCopied ? 'Copied' : 'Copy object';

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  // Get DAG asset information
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const { data, message: requestMessage } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<WithdrawDelegatedStakeData>(
      location.href
    );

  const { walletLabel, chainLabel, source, stakeRef } = data;

  const generateJsonMessage = (data: any): string => {
    if (!data) return '';

    return JSON.stringify(data, null, 4);
  };

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
      const withdrawDelegatedStakeBody: WithdrawDelegatedStakeBody = {
        source,
        stakeRef,
      };

      const withdrawDelegatedStakeResponse = await dag4.account.putWithdrawDelegatedStake(
        withdrawDelegatedStakeBody
      );

      if (!withdrawDelegatedStakeResponse || !withdrawDelegatedStakeResponse.hash) {
        throw new Error('Withdraw delegated stake transaction failed');
      }

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(
        withdrawDelegatedStakeResponse.hash,
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

  const message = generateJsonMessage({ stakeRef });

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="WithdrawDelegatedStake"
      subtitle={origin}
      fee={{
        show: false,
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
export default WithdrawDelegatedStakeView;
