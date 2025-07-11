import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WalletParam } from 'scripts/Background/messaging';

import styles from './styles.scss';

export type WithdrawDelegatedStakeProps = WithdrawDelegatedStake & {
  title: string;
  wallet: WalletParam;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const WithdrawDelegatedStakeView = ({ title, wallet, source, stakeRef, isLoading, onSign, onReject }: WithdrawDelegatedStakeProps) => {
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const message = JSON.stringify({ source, stakeRef }, null, 4);
  const isDisabled = accountChanged || networkChanged;

  return (
    <CardLayoutV3 logo={current?.logo} title={title} subtitle={current?.origin} isPositiveButtonLoading={isLoading} isPositiveButtonDisabled={isDisabled} onNegativeButtonClick={onReject} onPositiveButtonClick={onSign}>
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={message} />
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default WithdrawDelegatedStakeView;
