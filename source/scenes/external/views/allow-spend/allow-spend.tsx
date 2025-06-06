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

const renderMetagraphValue = (destinationInfo: { isMetagraph: boolean; logo: string; label: string }) => {
  if (!destinationInfo?.isMetagraph) return null;

  return (
    <div className={styles.valueContainer}>
      <img src={destinationInfo?.logo} alt="Metagraph logo" className={styles.logo} />
      <TextV3.CaptionRegular extraStyles={styles.label}>{destinationInfo?.label}</TextV3.CaptionRegular>
    </div>
  );
};

const renderAllowSpendMessage = (amount: string, spenderInfo: any, spenderAddress: string) => {
  const spenderName = spenderInfo?.isMetagraph ? spenderInfo?.label : `${spenderAddress.slice(0, 6)}...${spenderAddress.slice(-4)}`;

  return (
    <TextV3.CaptionRegular extraStyles={styles.description}>
      Allow <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{spenderName}</TextV3.CaptionStrong> to spend <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>{amount}</TextV3.CaptionStrong> from your wallet. These
      tokens will be temporarily locked until spent.
    </TextV3.CaptionRegular>
  );
};

export interface IAllowSpendProps {
  title: string;
  asset: IAssetInfoState;
  amount: number;
  destination: string;
  destinationInfo: {
    isMetagraph: boolean;
    label: string;
    logo: string;
  };
  spenderInfo: {
    isMetagraph: boolean;
    label: string;
    logo: string;
  };
  approvers: string[];
  validUntilEpoch: number;
  latestEpoch: number;
  fee: string;
  setFee: (fee: string) => void;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const AllowSpendView = ({ title, amount: amountInDatum, destination, destinationInfo, spenderInfo, approvers, validUntilEpoch, latestEpoch, fee, setFee, isLoading, asset, onSign, onReject }: IAllowSpendProps) => {
  const { current, activeWallet, constellationNetwork } = useExternalViewData();
  const amount = formatBigNumberForDisplay(toDag(amountInDatum));
  const spenderAddress = approvers[0];

  if (!asset) return null;

  const amountString = `${amount} ${asset.symbol}`;
  const feeNumber = Number(fee);
  const recommendedFee = '0';

  return (
    <CardLayoutV3
      title={title}
      logo={current?.logo}
      subtitle={current?.origin}
      fee={{
        show: true,
        defaultValue: feeNumber.toString(),
        value: fee,
        recommended: recommendedFee,
        symbol: asset.symbol,
        disabled: false,
        setFee,
      }}
      isPositiveButtonLoading={isLoading}
      onNegativeButtonClick={onReject}
      onPositiveButtonClick={onSign}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} />
          <CardRow label="Network:" value={constellationNetwork} />
          {destinationInfo?.isMetagraph && <CardRow label="Metagraph:" value={renderMetagraphValue(destinationInfo)} />}
        </Card>
        <Card>
          <CardRow.Token label="Token:" value={asset} />
          <CardRow label="Amount:" value={amountString} />
          <CardRow label="Valid Until Epoch:" value={renderEpochValue(validUntilEpoch, latestEpoch)} />
        </Card>
        <Card>
          {!destinationInfo?.isMetagraph && <CardRow.Address label="Destination:" value={destination} />}
          <CardRow.Address label="Allowed Spender:" value={spenderAddress} />
        </Card>
        <Card>{renderAllowSpendMessage(amountString, spenderInfo, spenderAddress)}</Card>
      </div>
    </CardLayoutV3>
  );
};

export default AllowSpendView;
