import type { DelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

export type DelegatedStakeProps = DelegatedStake & {
  title: string;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const DelegatedStakeView = ({ title, amount, nodeId, tokenLockRef, fee, isLoading, onSign, onReject }: DelegatedStakeProps) => {
  const { current, activeWallet, constellationNetwork } = useExternalViewData();

  const stakeData = {
    amount: formatBigNumberForDisplay(toDag(amount)),
    fee: formatBigNumberForDisplay(toDag(fee ?? 0)),
    nodeId,
    tokenLockRef,
  };

  const message = JSON.stringify(stakeData, null, 4);

  return (
    <CardLayoutV3 title={title} logo={current?.logo} subtitle={current?.origin} isPositiveButtonLoading={isLoading} onNegativeButtonClick={onReject} onPositiveButtonClick={onSign}>
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} />
          <CardRow label="Network:" value={constellationNetwork} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={message} />
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default DelegatedStakeView;
