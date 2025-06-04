import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { DelegatedStakeData } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';
import dappSelectors from 'selectors/dappSelectors';

import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

export type DelegatedStakeProps = DelegatedStakeData & {
  title: string;
  isPositiveButtonLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const DelegatedStakeView = ({ title, wallet, chain, amount, nodeId, tokenLockRef, fee, isPositiveButtonLoading, onSign, onReject }: DelegatedStakeProps) => {
  const [feeValue, setFeeValue] = useState('0');
  const [stakeData, setStakeData] = useState(null);

  const current = useSelector(dappSelectors.getCurrent);
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const generateJsonMessage = (data: any): string => {
    if (!data) return '';

    return JSON.stringify(data, null, 4);
  };

  useEffect(() => {
    if (!stakeData) {
      const stakeInfo = {
        amount: formatBigNumberForDisplay(toDag(amount)),
        fee: formatBigNumberForDisplay(toDag(fee) ?? 0),
        nodeId,
        tokenLockRef,
      };
      setStakeData(stakeInfo);
    }
  }, []);

  useEffect(() => {
    if (feeValue) {
      const stakeInfo = {
        amount: formatBigNumberForDisplay(toDag(amount)),
        fee: formatBigNumberForDisplay(toDag(feeValue)),
        nodeId,
        tokenLockRef,
      };
      setStakeData(stakeInfo);
    }
  }, [feeValue]);

  // Convert fee to DAG
  const feeAmount = toDag(fee ?? 0);

  useEffect(() => {
    if (!!feeAmount && feeAmount !== null && feeAmount !== undefined) {
      setFeeValue(feeAmount.toString());
    }
  }, [feeAmount]);

  const message = generateJsonMessage(stakeData);

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
        symbol: dagAsset?.symbol,
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
          <CardRow.Object label="Transaction data:" value={message} />
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default DelegatedStakeView;
