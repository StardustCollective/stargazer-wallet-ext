import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import styles from './styles.scss';

export type WithdrawDelegatedStakeProps = WithdrawDelegatedStake & {
  title: string;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const WithdrawDelegatedStakeView = ({ title, source, stakeRef, isLoading, onSign, onReject }: WithdrawDelegatedStakeProps) => {
  const { current, activeWallet, constellationNetwork } = useExternalViewData();
  const message = JSON.stringify({ source, stakeRef }, null, 4);

  return (
    <CardLayoutV3 logo={current?.logo} title={title} subtitle={current?.origin} isPositiveButtonLoading={isLoading} onNegativeButtonClick={onReject} onPositiveButtonClick={onSign}>
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

export default WithdrawDelegatedStakeView;
