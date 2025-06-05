import React from 'react';

import TextV3 from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { IAssetInfoState } from 'state/assets/types';

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
  asset: IAssetInfoState;
  amount: number;
  unlockEpoch: number | null;
  latestEpoch: number | null;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const TokenLockView = ({ title, amount: amountInDatum, unlockEpoch, latestEpoch, isLoading, asset, onSign, onReject }: ITokenLockProps) => {
  const { current, activeWallet, constellationNetwork } = useExternalViewData();
  const amount = formatBigNumberForDisplay(toDag(amountInDatum));

  if (!asset) return null;

  const amountString = `${amount} ${asset.symbol}`;

  return (
    <CardLayoutV3 title={title} logo={current?.logo} subtitle={current?.origin} isPositiveButtonLoading={isLoading} onNegativeButtonClick={onReject} onPositiveButtonClick={onSign}>
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} />
          <CardRow label="Network:" value={constellationNetwork} />
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
