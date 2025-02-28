import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import Tooltip from 'components/Tooltip';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { useCopyClipboard } from 'hooks/index';
import dappSelectors from 'selectors/dappSelectors';
import assetsSelectors from 'selectors/assetsSelectors';
import styles from './index.scss';
import { ellipsis } from 'scenes/home/helpers';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { AllowSpendData } from './types';

const AllowSpend = () => {
  const [fee, setFee] = useState('0');

  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';

  const { data, message } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<AllowSpendData>(
      location.href
    );

  const { walletLabel, chainLabel, token, amount, spenderAddress, metagraphAddress } =
    data;

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  const metagraphAsset = useSelector(assetsSelectors.getAssetByAddress(metagraphAddress));
  const tokenAsset = useSelector(assetsSelectors.getAssetBySymbol(token));
  if (!metagraphAsset || !tokenAsset) return null;

  const amountString = `${amount.toLocaleString()} ${token}`;

  const onNegativeButtonClick = async () => {
    console.log('Reject');

    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );
    window.close();
  };

  const onPositiveButtonClick = async () => {
    console.log('Approve');

    try {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult('Approved', message);
    } catch (e) {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(e, message);
    }

    window.close();
  };

  const renderCopyAddress = () => {
    return (
      <Tooltip title={textTooltip} placement="bottom" arrow>
        <div
          className={styles.copyAddressContainer}
          onClick={() => copyAddress(spenderAddress)}
        >
          <TextV3.CaptionStrong extraStyles={styles.copyAddress}>
            {ellipsis(spenderAddress)}
          </TextV3.CaptionStrong>
          <img src={`/${CopyIcon}`} alt="Copy" />
        </div>
      </Tooltip>
    );
  };

  const renderMetagraphValue = () => {
    return (
      <div className={styles.valueContainer}>
        <img src={metagraphAsset.logo} alt="Metagraph logo" className={styles.logo} />
        <TextV3.CaptionRegular extraStyles={styles.label}>
          {metagraphAsset.label}
        </TextV3.CaptionRegular>
      </div>
    );
  };

  const renderTokenValue = () => {
    return (
      <div className={styles.valueContainer}>
        <img src={tokenAsset.logo} alt="Token logo" className={styles.logo} />
        <TextV3.CaptionRegular extraStyles={styles.label}>
          {tokenAsset.symbol}
        </TextV3.CaptionRegular>
      </div>
    );
  };

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="AllowSpend"
      subtitle={origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: fee,
        symbol: tokenAsset.symbol,
        disabled: false,
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
          <CardRow label="Token:" value={renderTokenValue()} />
          <CardRow label="Amount:" value={amountString} />
        </Card>
        <Card>
          <CardRow label="Allowed Spender:" value={renderCopyAddress()} />
        </Card>
        <Card>
          <TextV3.CaptionRegular extraStyles={styles.description}>
            Allow{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {current?.title}
            </TextV3.CaptionStrong>{' '}
            to spend{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {amountString}
            </TextV3.CaptionStrong>{' '}
            from your wallet. These tokens will be temporarily locked in your wallet until
            the Metagraph spends them.
          </TextV3.CaptionRegular>
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export * from './types';
export default AllowSpend;
