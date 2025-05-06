import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import TextV3 from 'components/TextV3';
import dappSelectors from 'selectors/dappSelectors';
import assetsSelectors from 'selectors/assetsSelectors';
import styles from './index.scss';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { TokenLockData } from './types';
import { differenceBetweenEpochs } from 'utils/epochs';
import { formatBigNumberForDisplay, toDag } from 'utils/number';
import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';
import { usePlatformAlert } from 'utils/alertUtil';
import {
  HashResponse,
  TokenLock as TokenLockBody,
} from '@stardust-collective/dag4-network';

const renderTokenValue = (tokenAsset: IAssetInfoState) => {
  return (
    <div className={styles.valueContainer}>
      <img src={tokenAsset?.logo} alt="Token logo" className={styles.logo} />
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {tokenAsset?.symbol}
      </TextV3.CaptionRegular>
    </div>
  );
};

const renderEpochValue = (epochValue: number, latestEpoch: number) => {
  return (
    <div className={styles.epochContainer}>
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {epochValue.toLocaleString()}
      </TextV3.CaptionRegular>
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {`~ ${differenceBetweenEpochs(latestEpoch, epochValue)}`}
      </TextV3.CaptionRegular>
    </div>
  );
};

const renderLockMessage = (amount: string, unlockEpoch: number) => {
  if (!unlockEpoch) {
    return (
      <TextV3.CaptionRegular extraStyles={styles.description}>
        Lock{' '}
        <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
          {amount}
        </TextV3.CaptionStrong>{' '}
        from your wallet.
      </TextV3.CaptionRegular>
    );
  }

  return (
    <TextV3.CaptionRegular extraStyles={styles.description}>
      Lock{' '}
      <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
        {amount}
      </TextV3.CaptionStrong>{' '}
      from your wallet until{' '}
      <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
        Epoch {unlockEpoch?.toLocaleString()}
      </TextV3.CaptionStrong>
      .
    </TextV3.CaptionRegular>
  );
};

const TokenLock = () => {
  const assets = store.getState().assets;

  const [feeValue, setFeeValue] = useState('0');
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  // Get DAG asset information
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const { data, message } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<TokenLockData>(
      location.href
    );

  const {
    walletLabel,
    chainLabel,
    currencyId,
    amount: amountValue,
    unlockEpoch,
    fee,
    latestEpoch,
  } = data;

  // Convert amount and fee to DAG
  const feeAmount = toDag(fee);
  const amount = formatBigNumberForDisplay(toDag(amountValue));

  // Get token asset information
  const tokenAssetByCurrency =
    currencyId && Object.values(assets).find((asset) => asset?.address === currencyId);

  let tokenAsset: IAssetInfoState | null = null;

  if (!currencyId && dagAsset) {
    tokenAsset = dagAsset;
  } else if (tokenAssetByCurrency) {
    tokenAsset = tokenAssetByCurrency;
  }

  if (!tokenAsset) return null;

  useEffect(() => {
    if (feeAmount !== null && feeAmount !== undefined) {
      setFeeValue(feeAmount.toString());
    }
  }, [feeAmount]);

  const amountString = `${amount} ${tokenAsset.symbol}`;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );
    window.close();
  };

  const sendTokenLockTransaction = async (): Promise<string> => {
    const tokenLockBody: TokenLockBody = {
      source: data.source,
      amount: data.amount,
      fee: 0,
      unlockEpoch: data.unlockEpoch,
    };

    let tokenLockResponse: HashResponse | null = null;

    if (!currencyId) {
      // Send transaction to DAG
      tokenLockResponse = await dag4.account.createTokenLock(tokenLockBody);
    } else {
      // Send transaction to metagraph
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: tokenAssetByCurrency.address,
        id: tokenAssetByCurrency.address,
        l0Url: tokenAssetByCurrency.l0endpoint,
        l1Url: tokenAssetByCurrency.l1endpoint,
        beUrl: '',
      });

      tokenLockResponse = await metagraphClient.createTokenLock(tokenLockBody);
    }

    if (!tokenLockResponse || !tokenLockResponse?.hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return tokenLockResponse.hash;
  };

  const onPositiveButtonClick = async () => {
    setLoading(true);
    try {
      const txHash = await sendTokenLockTransaction();

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(txHash, message);
    } catch (e) {
      const errorMessage =
        (e instanceof Error && e?.message) ||
        'There was an error with the transaction.\nPlease try again later.';
      showAlert(errorMessage, 'danger');
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(e, message);
      setLoading(false);
      return;
    }

    window.close();
  };

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="TokenLock"
      subtitle={origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: feeValue,
        symbol: tokenAsset.symbol,
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
          <CardRow label="Token:" value={renderTokenValue(tokenAsset)} />
          <CardRow label="Amount:" value={amountString} />
          {!!latestEpoch && !!unlockEpoch && (
            <CardRow
              label="Unlock Epoch:"
              value={renderEpochValue(unlockEpoch, latestEpoch)}
            />
          )}
        </Card>
        <Card>{renderLockMessage(amountString, unlockEpoch)}</Card>
      </div>
    </CardLayoutV3>
  );
};

export * from './types';
export default TokenLock;
