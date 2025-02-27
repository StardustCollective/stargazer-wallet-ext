import React from 'react';
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
import { TokenLockData } from './types';

const TokenLock = () => {
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';

  const { data, message } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<TokenLockData>(
      location.href
    );

  const {
    walletLabel,
    chainLabel,
    token,
    amount,
    fee,
    spenderAddress,
    metagraphAddress,
    unlockEpoch,
  } = data;

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  const metagraphAsset = useSelector(assetsSelectors.getAssetByAddress(metagraphAddress));
  const tokenAsset = useSelector(assetsSelectors.getAssetBySymbol(token));
  if (!metagraphAsset || !tokenAsset) return null;

  const amountString = `${amount.toLocaleString()} ${token}`;
  const feeString = fee === 0 ? 'FREE' : fee.toString();

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
      StargazerWSMessageBroker.sendResponseResult('Approve', message);
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
      title="TokenLock"
      subtitle={origin}
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
          <CardRow label="Fee:" value={feeString} />
          <CardRow label="Unlock Epoch:" value={unlockEpoch.toLocaleString()} />
        </Card>
        <Card>
          <CardRow label="Source:" value={renderCopyAddress()} />
        </Card>
        <Card>
          <TextV3.CaptionRegular extraStyles={styles.description}>
            Allow{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {current?.title}
            </TextV3.CaptionStrong>{' '}
            to lock{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {amountString}
            </TextV3.CaptionStrong>{' '}
            from your wallet until{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              Epoch {unlockEpoch.toLocaleString()}.
            </TextV3.CaptionStrong>
          </TextV3.CaptionRegular>
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export * from './types';
export default TokenLock;
