import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WithdrawDelegatedStakeData } from 'scripts/Provider/constellation';

import assetsSelectors from 'selectors/assetsSelectors';
import dappSelectors from 'selectors/dappSelectors';

import styles from './styles.scss';

export type WithdrawDelegatedStakeProps = WithdrawDelegatedStakeData & {
  title: string;
  isPositiveButtonLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const WithdrawDelegatedStakeView = ({ title, wallet, chain, source, stakeRef, isPositiveButtonLoading, onSign, onReject }: WithdrawDelegatedStakeProps) => {
  const [feeValue, setFeeValue] = useState('0');
  const [withdrawData, setWithdrawData] = useState(null);

  const current = useSelector(dappSelectors.getCurrent);
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const generateJsonMessage = (data: any): string => {
    if (!data) return '';

    return JSON.stringify(data, null, 4);
  };

  useEffect(() => {
    if (!withdrawData) {
      const withdrawInfo = {
        source,
        stakeRef,
      };
      setWithdrawData(withdrawInfo);
    }
  }, [source, stakeRef, withdrawData]);

  const message = generateJsonMessage(withdrawData);

  return (
    <CardLayoutV3
      logo={current?.logo}
      title={title}
      subtitle={current?.origin}
      fee={{
        show: false,
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

export default WithdrawDelegatedStakeView;
