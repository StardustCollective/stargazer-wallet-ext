import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import TextV3 from 'components/TextV3';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import assetsSelectors from 'selectors/assetsSelectors';
import dappSelectors from 'selectors/dappSelectors';

import store from 'state/store';

import { differenceBetweenEpochs } from 'utils/epochs';
import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

const renderEpochValue = (epochValue: number, latestEpoch: number) => {
  return (
    <div className={styles.epochContainer}>
      <TextV3.CaptionRegular extraStyles={styles.label}>{epochValue.toLocaleString()}</TextV3.CaptionRegular>
      <TextV3.CaptionRegular extraStyles={styles.label}>{`~ ${differenceBetweenEpochs(latestEpoch, epochValue)}`}</TextV3.CaptionRegular>
    </div>
  );
};

const renderLockMessage = (amount: string, unlockEpoch: number) => {
  if (!unlockEpoch) {
    return (
      <TextV3.CaptionRegular extraStyles={styles.description}>
        Lock <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{amount}</TextV3.CaptionStrong> from your wallet.
      </TextV3.CaptionRegular>
    );
  }

  return (
    <TextV3.CaptionRegular extraStyles={styles.description}>
      Lock <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{amount}</TextV3.CaptionStrong> from your wallet until{' '}
      <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>Epoch {unlockEpoch?.toLocaleString()}</TextV3.CaptionStrong>.
    </TextV3.CaptionRegular>
  );
};

export interface ITokenLockProps {
  title: string;
  wallet: string;
  chain: string;
  currencyId: string;
  amount: number;
  unlockEpoch: number;
  fee: number;
  latestEpoch: number;
  isPositiveButtonLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const TokenLockView = ({ title, wallet, chain, currencyId, amount: amountInDatum, unlockEpoch, fee: feeInDatum, latestEpoch, isPositiveButtonLoading, onSign, onReject }: ITokenLockProps) => {
  const [feeValue, setFeeValue] = useState('0');

  const current = useSelector(dappSelectors.getCurrent);
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const { assets } = store.getState();

  // Convert amount and fee to DAG
  const fee = toDag(feeInDatum);
  const amount = formatBigNumberForDisplay(toDag(amountInDatum));

  // Get asset information
  const asset = useMemo(() => {
    if (!currencyId) return dagAsset;
    return Object.values(assets).find(a => a?.address === currencyId) ?? null;
  }, [assets, currencyId, dagAsset]);

  if (!asset) return null;

  useEffect(() => {
    if (fee !== null && fee !== undefined) {
      setFeeValue(fee.toString());
    }
  }, [fee]);

  const amountString = `${amount} ${asset.symbol}`;

  return (
    <CardLayoutV3
      logo={current?.logo}
      title={title}
      subtitle={current?.origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: feeValue,
        recommended: '0',
        symbol: asset.symbol,
        disabled: true,
        setFee: setFeeValue,
      }}
      isPositiveButtonLoading={isPositiveButtonLoading}
      onNegativeButtonClick={onReject}
      onPositiveButtonClick={onSign}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={wallet} />
          <CardRow label="Network:" value={chain} />
        </Card>
        <Card>
          <CardRow.Token label="Token:" value={asset} />
          <CardRow label="Amount:" value={amountString} />
          {!!latestEpoch && !!unlockEpoch && <CardRow label="Unlock Epoch:" value={renderEpochValue(unlockEpoch, latestEpoch)} />}
        </Card>
        <Card>{renderLockMessage(amountString, unlockEpoch)}</Card>
      </div>
    </CardLayoutV3>
  );
};

export default TokenLockView;
