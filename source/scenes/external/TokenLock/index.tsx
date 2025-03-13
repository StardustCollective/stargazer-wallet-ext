import React from 'react';
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
import { toDag } from 'utils/number';
import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';
import { DAG_NETWORK } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import VaultSelectors from 'selectors/vaultSelectors';
import { dag4 } from '@stardust-collective/dag4';

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

const TokenLock = () => {
  const assets = store.getState().assets;

  const dagActiveNetwork = useSelector(
    VaultSelectors.getActiveNetworkByChain(KeyringNetwork.Constellation)
  );

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
    latestEpoch,
  } = data;

  // Convert amount to DAG
  const amount = toDag(amountValue);

  // Get token asset information
  const tokenAssetByCurrency =
    currencyId && Object.values(assets).find((asset) => asset?.address === currencyId);

  let tokenAsset: IAssetInfoState | null = null;
  let tokenL1Url: string | null = null;

  if (!currencyId && dagAsset) {
    tokenAsset = dagAsset;
    tokenL1Url = DAG_NETWORK[dagActiveNetwork]?.config?.l1Url || null;
  } else if (tokenAssetByCurrency) {
    tokenAsset = tokenAssetByCurrency;
    tokenL1Url = tokenAssetByCurrency?.l1endpoint || null;
  }

  if (!tokenAsset || !tokenL1Url) return null;

  const amountString = `${amount.toLocaleString()} ${tokenAsset.symbol}`;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );
    window.close();
  };

  const onPositiveButtonClick = async () => {

    try {

      const tokenLockBody = {
        source: data.source,
        amount: data.amount,
        unlockEpoch: data.unlockEpoch,
        currencyId: data.currencyId,
        tokenL1Url,
      };

      const tokenLockResponse = await dag4.account.postTokenLock(tokenLockBody);

      if (!tokenLockResponse || !tokenLockResponse?.hash) {
        throw new Error('Failed to generate signed token lock transaction');
      }

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(tokenLockResponse.hash, message);
    } catch (e) {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(e, message);
    }

    window.close();
  };

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="TokenLock"
      subtitle={origin}
      fee={{
        show: false,
        defaultValue: '0',
        value: '0',
        symbol: tokenAsset.symbol,
        disabled: false,
        setFee: () => {},
      }}
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
          <CardRow label="Unlock Epoch:" value={renderEpochValue(unlockEpoch, latestEpoch)} />
        </Card>
        <Card>
          <TextV3.CaptionRegular extraStyles={styles.description}>
            Lock{' '}
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
